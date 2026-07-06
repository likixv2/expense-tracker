"""
schemas/expense.py
-------------------
Defines exactly what data FastAPI should ACCEPT (from the frontend) and
what it should SEND BACK for expenses.
"""

from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class SplitType(str, Enum):
    equal = "equal"
    exact = "exact"
    percentage = "percentage"


class ExpenseSplitIn(BaseModel):
    user_id: int
    value: Optional[float] = None


class ExpenseCreate(BaseModel):
    description: str
    amount: float
    category: str = "general"
    split_type: SplitType = SplitType.equal
    participants: List[ExpenseSplitIn]


class ExpenseSplitOut(BaseModel):
    user_id: int
    share_amount: float

    class Config:
        from_attributes = True


class ExpenseOut(BaseModel):
    id: int
    group_id: int
    paid_by: int
    description: str
    amount: float
    category: str
    splits: List[ExpenseSplitOut]

    class Config:
        from_attributes = True