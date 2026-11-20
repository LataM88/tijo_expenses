from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.category_schema import CategoryCreate, CategoryOut
from app.services import category_service

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return category_service.get_all_categories(db)


@router.post("/", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return category_service.create_category(db, category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category_service.delete_category(db, category_id)
