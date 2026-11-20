from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category_schema import CategoryOut


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)
    date: date
    description: str | None = None
    category_id: int


class ExpenseOut(BaseModel):
    id: int
    amount: Decimal
    date: date
    description: str | None
    category_id: int
    category: CategoryOut

    model_config = ConfigDict(from_attributes=True)
