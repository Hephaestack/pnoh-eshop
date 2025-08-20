from typing import List, Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel

from .order_item import OrderItemOut

class OrderBase(BaseModel):
    id: UUID
    status: str
    payment_status: str
    currency: str
    subtotal_amount: Decimal
    discount_amount: Decimal
    shipping_amount: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderOut(OrderBase):
    items: List[OrderItemOut]
    email: Optional[str] = None
    user_id: Optional[str] = None
    guest_session_id: Optional[str] = None