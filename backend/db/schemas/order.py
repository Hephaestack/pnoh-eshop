from pydantic import BaseModel
from uuid import UUID
from typing import List
from datetime import datetime

class OrderSummary(BaseModel):
    id: UUID
    total_amount: float
    status: str
    payment_status: str
    order_date: datetime
    user: 'UserSummary'
    shipping_address: 'AddressSummary'
    order_items: List['ProductSummary']

    class Config:
        orm_mode = True

from db.schemas.user import UserSummary
from db.schemas.address import AddressSummary
from db.schemas.product import ProductSummary
OrderSummary.model_rebuild()