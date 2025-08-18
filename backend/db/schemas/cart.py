from pydantic import BaseModel, Field
from uuid import UUID
from typing import List
from .cart_item import CartItemOut

class CartSummary(BaseModel):
    items: List[CartItemOut] = Field(default_factory=list)
    total_items: int
    subtotal: float

    class Config:
        from_attributes = True
