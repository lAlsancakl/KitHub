import hashlib
import os
import secrets
import uuid

from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from typing import Optional

from config.helpers import hash_password, verify_password, get_current_user
from config.database import get_db
from pydantic import BaseModel

router = APIRouter()

UPLOAD_DIR = Path("uploads/profiles")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/register")
async def register_user(
    username: str = Form(...),
    password_hash: str = Form(...),
    gender: str = Form(...),
    birth_date: date = Form(...),
    profile_photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    saved_photo = None

    try:
        if not username.strip() or not password_hash:
            raise HTTPException(status_code=400, detail="Please fill in all required fields.")

        if gender not in ["male", "female", "other"]:
            raise HTTPException(status_code=400, detail="Invalid gender.")

        if profile_photo and profile_photo.filename:
            if not profile_photo.content_type or not profile_photo.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Please upload an image.")

            extension = Path(profile_photo.filename).suffix.lower()

            if extension not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
                raise HTTPException(status_code=400, detail="Unsupported image format.")

            photo_data = await profile_photo.read()

            if len(photo_data) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Image must be smaller than 5 MB.")

            filename = f"{uuid.uuid4().hex}{extension}"
            photo_path = UPLOAD_DIR / filename

            with open(photo_path, "wb") as f:
                f.write(photo_data)

            saved_photo = f"uploads/profiles/{filename}"

        hashed_password = hash_password(password_hash)

        db.execute(
            text("""
                INSERT INTO users
                (username, password_hash, gender, birth_date, profile_photo)
                VALUES
                (:username, :password_hash, :gender, :birth_date, :profile_photo)
            """),
            {
                "username": username.strip(),
                "password_hash": hashed_password,
                "gender": gender,
                "birth_date": birth_date,
                "profile_photo": saved_photo
            }
        )

        db.commit()

        return JSONResponse(
            status_code=200,
            content={"message": "Registration successful!"}
        )

    except IntegrityError:
        db.rollback()

        if saved_photo and os.path.exists(saved_photo):
            os.remove(saved_photo)

        return JSONResponse(
            status_code=409,
            content={"detail": "This username is already taken."}
        )

    except Exception:
        db.rollback()

        if saved_photo and os.path.exists(saved_photo):
            os.remove(saved_photo)

        raise


@router.post("/login")
def login(
    username: str = Form(...),
    password_hash: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.execute(
        text("""
            SELECT user_id, username, password_hash, profile_photo
            FROM users
            WHERE username = :username
        """),
        {"username": username.strip()}
    ).mappings().first()

    if not user or not verify_password(
        password_hash, user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    expires_at = datetime.now(timezone.utc).replace(
        tzinfo=None
    ) + timedelta(days=7)

    db.execute(
        text("""
            INSERT INTO login_sessions
                (user_id, token_hash, expires_at)
            VALUES
                (:user_id, :token_hash, :expires_at)
        """),
        {
            "user_id": user["user_id"],
            "token_hash": token_hash,
            "expires_at": expires_at
        }
    )

    db.commit()

    response = JSONResponse({
        "message": "Login successful",
        "username": user["username"]
    })

    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )

    return response


@router.get("/me")
def me(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)

    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "profile_photo": user["profile_photo"]
    }


@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("session_token")

    if token:
        token_hash = hashlib.sha256(
            token.encode("utf-8")
        ).hexdigest()

        db.execute(
            text("""
                DELETE FROM login_sessions
                WHERE token_hash = :token_hash
            """),
            {"token_hash": token_hash}
        )

        db.commit()

    response = JSONResponse({
        "message": "Logout successful"
    })

    response.delete_cookie(
        key="session_token",
        path="/"
    )

    return response

@router.post("/save-reading")
async def save_reading(
    request: Request,
    bookTitle: str = Form(...),
    author: str = Form(...),
    totalPages: int = Form(...),
    readingStatus: str = Form(...),
    bookCover: UploadFile = File(...),
    currentPage: Optional[int] = Form(0),       # Optional yaptık
    readingDuration: Optional[int] = Form(None), # Optional yaptık
    db: Session = Depends(get_db)
):
    user = get_current_user(request, db)

    saved_cover = None

    try:
        if not bookTitle.strip() or totalPages < 1:
            raise HTTPException(status_code=400, detail="Invalid book information.")

        if readingStatus not in ["want_to_read", "reading", "finished", "dropped"]:
            raise HTTPException(status_code=400, detail="Invalid reading status.")

        if readingStatus == "reading":
            if currentPage < 1 or currentPage > totalPages:
                raise HTTPException(status_code=400, detail="Invalid current page.")

        if readingStatus == "finished":
            if not readingDuration or readingDuration < 1:
                raise HTTPException(status_code=400, detail="Invalid reading duration.")

        if not bookCover or not bookCover.filename:
            raise HTTPException(status_code=400, detail="Book cover is required.")

        if not bookCover.content_type or not bookCover.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Please upload an image.")

        extension = Path(bookCover.filename).suffix.lower()

        if extension not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            raise HTTPException(status_code=400, detail="Unsupported image format.")

        cover_data = await bookCover.read()

        if len(cover_data) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image must be smaller than 5 MB.")

        # Check if the book already exists
        book = db.execute(
            text("""
                SELECT book_id
                FROM books
                WHERE LOWER(title) = LOWER(:title)
                AND LOWER(COALESCE(author, '')) = LOWER(:author)
                AND page_count = :page_count
                LIMIT 1
            """),
            {
                "title": bookTitle.strip(),
                "author": author.strip(),
                "page_count": totalPages
            }
        ).mappings().first()

        # Insert the book if it does not exist
        if book:
            book_id = book["book_id"]

        else:
            upload_dir = Path("uploads/book_cover")
            upload_dir.mkdir(parents=True, exist_ok=True)

            filename = f"{uuid.uuid4().hex}{extension}"
            cover_path = upload_dir / filename

            with open(cover_path, "wb") as f:
                f.write(cover_data)

            saved_cover = f"uploads/book_cover/{filename}"

            result = db.execute(
                text("""
                    INSERT INTO books (title, author, page_count, book_cover)
                    VALUES (:title, :author, :page_count, :book_cover)
                """),
                {
                    "title": bookTitle.strip(),
                    "author": author.strip(),
                    "page_count": totalPages,
                    "book_cover": saved_cover
                }
            )

            book_id = result.lastrowid

        today = date.today()

        started_at = None
        finished_at = None
        reading_days = 0
        current_page = 0

        if readingStatus == "reading":
            started_at = today
            current_page = currentPage

        elif readingStatus == "finished":
            reading_days = readingDuration
            finished_at = today
            started_at = today - timedelta(days=readingDuration - 1)
            current_page = totalPages

        elif readingStatus == "dropped":
            started_at = None

        # Check whether this user already has this book
        existing_reading = db.execute(
            text("""
                SELECT user_book_id
                FROM user_books
                WHERE user_id = :user_id AND book_id = :book_id
            """),
            {
                "user_id": user["user_id"],
                "book_id": book_id
            }
        ).mappings().first()

        if existing_reading:
            user_book_id = existing_reading["user_book_id"]

            db.execute(
                text("""
                    UPDATE user_books
                    SET status = :status,
                        current_page = :current_page,
                        started_at = :started_at,
                        finished_at = :finished_at,
                        reading_days = :reading_days
                    WHERE user_book_id = :user_book_id
                """),
                {
                    "status": readingStatus,
                    "current_page": current_page,
                    "started_at": started_at,
                    "finished_at": finished_at,
                    "reading_days": reading_days,
                    "user_book_id": user_book_id
                }
            )

        else:
            user_book_result = db.execute(
                text("""
                    INSERT INTO user_books
                    (user_id, book_id, status, current_page,
                     started_at, finished_at, reading_days)
                    VALUES
                    (:user_id, :book_id, :status, :current_page,
                     :started_at, :finished_at, :reading_days)
                """),
                {
                    "user_id": user["user_id"],
                    "book_id": book_id,
                    "status": readingStatus,
                    "current_page": current_page,
                    "started_at": started_at,
                    "finished_at": finished_at,
                    "reading_days": reading_days
                }
            )

            user_book_id = user_book_result.lastrowid

        status_messages = {
            "want_to_read": f"Added {bookTitle} by {author} to my reading list!",
            "reading": f"Started reading {bookTitle} by {author}!",
            "finished": f"Finished reading {bookTitle} by {author} in {readingDuration} days!",
            "dropped": f"Stopped reading {bookTitle} by {author}."
        }

        db.execute(
            text("""
                INSERT INTO posts
                (user_id, user_book_id, content, post_type)
                VALUES
                (:user_id, :user_book_id, :content, :post_type)
            """),
            {
                "user_id": user["user_id"],
                "user_book_id": user_book_id,
                "content": status_messages[readingStatus],
                "post_type": "reading"
            }
        )

        db.commit()

        return JSONResponse(
            status_code=200,
            content={"message": "Reading saved successfully!"}
        )

    except Exception:
        db.rollback()

        if saved_cover and os.path.exists(saved_cover):
            os.remove(saved_cover)

        raise

@router.get("/api/profile/{username}")
def get_user_profile(username: str, db: Session = Depends(get_db)):
    user = db.execute(
        text("""
            SELECT user_id, username, profile_photo, created_at
            FROM users
            WHERE LOWER(username) = LOWER(:username)
            LIMIT 1
        """),
        {"username": username.strip()}
    ).mappings().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    created_at = user["created_at"]
    joined_text = (
        f"Joined {created_at.strftime('%B %Y')}"
        if created_at else "Joined recently"
    )

    photo_url = (
        "/" + user["profile_photo"].lstrip("/")
        if user["profile_photo"] else "/public/images/default-profile.png"
    )

    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "profile_photo": photo_url,
        "created_at": created_at.isoformat() if created_at else None,
        "joined_text": joined_text
    }


@router.get("/api/review-books")
def get_review_books(
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. Token'dan giriş yapan kullanıcıyı bul.
    user = get_current_user(request, db)

    # 2. Kullanıcının bitirdiği kitapları MySQL'den al.
    books = db.execute(
        text("""
            SELECT
                b.book_id,
                b.title,
                b.author,
                b.book_cover
            FROM user_books ub
            JOIN books b ON ub.book_id = b.book_id
            WHERE ub.user_id = :user_id
              AND ub.status = 'finished'
            ORDER BY b.title
        """),
        {"user_id": user["user_id"]}
    ).mappings().all()

    # 3. Kitapları JavaScript'e JSON olarak gönder.
    return [
        {
            "id": book["book_id"],
            "title": book["title"],
            "author": book["author"],
            "cover": (
                "/" + book["book_cover"].lstrip("/")
                if book["book_cover"]
                else ""
            )
        }
        for book in books
    ]

class ReviewCreate(BaseModel):
    book_id: int
    title: str
    content: str
    spoiler: bool = False


@router.post("/api/reviews", status_code=201)
def create_review(
    review: ReviewCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    # Token üzerinden giriş yapan kullanıcıyı buluyoruz
    user = get_current_user(request, db)

    title = review.title.strip()
    content = review.content.strip()

    # Boş veya çok uzun yorumları engelliyoruz
    if not title or len(title) > 255:
        raise HTTPException(
            status_code=400,
            detail="Review title must be 1-255 characters."
        )

    if not content or len(content) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Review must be 1-2000 characters."
        )

    # Kullanıcı bu kitabı gerçekten bitirmiş mi?
    user_book = db.execute(
        text("""
            SELECT user_book_id
            FROM user_books
            WHERE user_id = :user_id
              AND book_id = :book_id
              AND status = 'finished'
        """),
        {
            "user_id": user["user_id"],
            "book_id": review.book_id
        }
    ).mappings().first()

    if not user_book:
        raise HTTPException(
            status_code=403,
            detail="You can only review books you have finished."
        )

    # Yorumu MySQL'e kaydediyoruz
    try:
        result = db.execute(
            text("""
                INSERT INTO posts
                    (user_id, user_book_id, post_title,
                     content, post_type, is_spoiler)
                VALUES
                    (:user_id, :user_book_id, :title,
                     :content, 'review', :spoiler)
            """),
            {
                "user_id": user["user_id"],
                "user_book_id": user_book["user_book_id"],
                "title": title,
                "content": content,
                "spoiler": review.spoiler
            }
        )

        post_id = result.lastrowid
        db.commit()

    except Exception:
        db.rollback()
        raise

    return {
        "message": "Review created successfully!",
        "post_id": post_id
    }
