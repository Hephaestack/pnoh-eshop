from pydantic import BaseModel, Field
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from .cart_item import CartItemSummary

class AddToCartBody(BaseModel):
    quantity: int = Field(..., gt=0)

class CartSummary(BaseModel):
    id: UUID
    user_id: UUID
    items: List[CartItemSummary]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
