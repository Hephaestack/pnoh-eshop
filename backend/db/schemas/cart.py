from pydantic import BaseModel, Field
from uuid import UUID
from typing import List
from .cart_item import CartItemSummary

class AddToCartBody(BaseModel):
    quantity: int = Field(..., gt=0)

class CartSummary(BaseModel):
    id: UUID
    user_id: UUID
    items: List[CartItemSummary]
    subtotal: float

    class Config:
        from_attributes = True
