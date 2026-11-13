from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.utils.utils import hash_password


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

