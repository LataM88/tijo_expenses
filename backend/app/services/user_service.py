from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import Token, UserCreate, UserLogin
from app.utils import (
    create_access_token,
    hash_password,
    verify_access_token,
    verify_password,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


def register_user(db: Session, user_data: UserCreate) -> User:
    normalized_email = user_data.email.lower()

    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Użytkownik o podanym adresie email już istnieje",
        )

    hashed_password = hash_password(user_data.password)

    new_user = User(
        email=normalized_email,
        password=hashed_password,
        first_name=user_data.first_name,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, user_cred: UserLogin) -> Token:
    normalized_email = user_cred.email.lower()

    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not verify_password(user_cred.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy adres email lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"user_id": user.id, "sub": user.email}
    )
    return Token(access_token=access_token, token_type="bearer")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nie można zweryfikować danych uwierzytelniających",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = verify_access_token(token, credentials_exception)
    user = db.query(User).filter(User.id == token_data.id).first()
    if user is None:
        raise credentials_exception

    return user
