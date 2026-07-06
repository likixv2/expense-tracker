"""
schemas/settlement.py
----------------------
Defines what data FastAPI accepts/returns for settlements, plus the
shape of a calculated balance entry.
"""

from pydantic import BaseModel


class SettlementCreate(BaseModel):
    paid_to: int
    amount: float


class SettlementOut(BaseModel):
    id: int
    group_id: int
    paid_by: int
    paid_to: int
    amount: float

    class Config:
        from_attributes = True


class BalanceEntry(BaseModel):
    from_user: int
    to_user: int
    amount: float