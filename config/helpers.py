import hashlib
import secrets

def hash_password(password):
    salt = secrets.token_hex(16)

    hashed = hashlib.sha256(
        (salt + password).encode("utf-8")
    ).hexdigest()

    return f"sha256${salt}${hashed}"