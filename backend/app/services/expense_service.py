from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.expense import Expense
from app.models.category import Category
from app.schemas.expense_schema import ExpenseCreate


def create_expense(db: Session, data: ExpenseCreate) -> Expense:
    # Sprawdź, czy kategoria istnieje
    category = db.query(Category).filter(Category.id == data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podana kategoria nie istnieje",
        )

    expense = Expense(
        amount=data.amount,
        date=data.date,
        description=data.description,
        category_id=data.category_id,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    # Załaduj relację category
    db.refresh(expense, attribute_names=["category"])
    return expense


def get_all_expenses(db: Session) -> list[Expense]:
    return (
        db.query(Expense)
        .options(joinedload(Expense.category))
        .order_by(Expense.date.desc())
        .all()
    )


def get_expense_by_id(db: Session, expense_id: int) -> Expense:
    expense = (
        db.query(Expense)
        .options(joinedload(Expense.category))
        .filter(Expense.id == expense_id)
        .first()
    )
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wydatek nie został znaleziony",
        )
    return expense


def delete_expense(db: Session, expense_id: int) -> None:
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wydatek nie został znaleziony",
        )
    db.delete(expense)
    db.commit()
