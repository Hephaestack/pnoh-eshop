from pydantic import BaseModel, Field
from uuid import UUID
from typing import List
from .cart_item import CartItemOut

class ShippingQuote(BaseModel):
    method: str
    label: str
    amount: float
    free_applied: bool

class CartSummary(BaseModel):
    items: List[CartItemOut] = Field(default_factory=list)
    total_items: int
    subtotal: float
    shipping_amount: float = 0.0
    free_shipping_threshold: float = 150.0
    free_shipping_applied: bool = False
    total: float = 0.0

    class Config:
        from_attributes = True
