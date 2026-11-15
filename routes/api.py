
import os
import uuid

from datetime import date
from pathlib import Path
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from config.helpers import hash_password

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
