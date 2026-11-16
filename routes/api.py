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

from config.helpers import hash_password, verify_password, get_current_user
from config.database import get_db

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