from pydantic import BaseModel, Field
from uuid import UUID
from typing import List
from .cart_item import CartItemSummary

class AddToCartBody(BaseModel):
    quantity: int = Field(..., gt=0)

class CartSummary(BaseModel):
    items: List[CartItemSummary]
    total_items: int
    subtotal: float

    class Config:
        from_attributes = True
