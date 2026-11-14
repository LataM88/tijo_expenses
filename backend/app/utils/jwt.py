from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
import jwt

from app.config import settings
from app.schemas.user_schema import TokenData


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_access_token(
    token: str, credentials_exception: HTTPException
) -> TokenData:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("user_id")
        email = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        return TokenData(id=int(user_id), email=email)
    except jwt.PyJWTError:
        raise credentials_exception

