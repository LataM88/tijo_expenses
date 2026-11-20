from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category_schema import CategoryCreate


def create_category(db: Session, data: CategoryCreate) -> Category:
    existing = db.query(Category).filter(Category.name == data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Kategoria '{data.name}' już istnieje",
        )

    category = Category(name=data.name, color=data.color)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_all_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name).all()


def get_category_by_id(db: Session, category_id: int) -> Category:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kategoria nie została znaleziona",
        )
    return category


def delete_category(db: Session, category_id: int) -> None:
    category = get_category_by_id(db, category_id)
    # FK z ondelete="RESTRICT" — jeśli są wydatki, baza zgłosi błąd
    try:
        db.delete(category)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Nie można usunąć kategorii — istnieją powiązane wydatki",
        )
