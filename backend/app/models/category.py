from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
class Category(Base):
    
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(7), nullable=False)
    expenses = relationship("Expense", back_populates="category")