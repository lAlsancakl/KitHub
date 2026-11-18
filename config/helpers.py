import hashlib
import hmac
import secrets

from fastapi import HTTPException, Request
from sqlalchemy import text
from sqlalchemy.orm import Session


def hash_password(password):
    salt = secrets.token_hex(16)

    hashed = hashlib.sha256(
        (salt + password).encode("utf-8")
    ).hexdigest()

    return f"sha256${salt}${hashed}"


def verify_password(password, stored_hash):
    try:
        algorithm, salt, original_hash = stored_hash.split("$")

        if algorithm != "sha256":
            return False

        new_hash = hashlib.sha256(
            (salt + password).encode("utf-8")
        ).hexdigest()

        return hmac.compare_digest(new_hash, original_hash)

    except (ValueError, AttributeError):
        return False


def get_current_user(request: Request, db: Session):
    token = request.cookies.get("session_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )

    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    user = db.execute(
        text("""
            SELECT u.user_id, u.username, u.profile_photo
            FROM login_sessions s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.token_hash = :token_hash
              AND s.expires_at > UTC_TIMESTAMP()
        """),
        {"token_hash": token_hash}
    ).mappings().first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Session expired or invalid"
        )

    return user