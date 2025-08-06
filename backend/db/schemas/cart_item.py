from pydantic import BaseModel
from uuid import UUID

class CartItemSummary(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int

    class Config:
        orm_mode = True

class CartItem(BaseModel):
    id: UUID
    cart_id: UUID
    product_id: UUID
    quantity: int

    class Config:
        orm_mode = True
