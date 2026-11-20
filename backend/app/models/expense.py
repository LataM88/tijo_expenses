from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(Date, nullable=False, server_default=func.current_date())
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    category = relationship("Category", back_populates="expenses")