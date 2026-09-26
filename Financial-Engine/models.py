from pydantic import BaseModel
from typing import List


class Goal(BaseModel):
    name: str
    target: float
    saved: float
    months_remaining: int
    monthly_contribution: float
    priority: int = 1


class FinancialData(BaseModel):
    income: float
    expenses: float
    scheduled_expenses: float
    current_savings: float
    goals: List[Goal]
