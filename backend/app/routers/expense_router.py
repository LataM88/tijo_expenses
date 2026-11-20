from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.expense_schema import ExpenseCreate, ExpenseOut
from app.services import expense_service

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/", response_model=list[ExpenseOut])
def list_expenses(db: Session = Depends(get_db)):
    return expense_service.get_all_expenses(db)


@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    return expense_service.get_expense_by_id(db, expense_id)


@router.post("/", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_service.create_expense(db, expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense_service.delete_expense(db, expense_id)
