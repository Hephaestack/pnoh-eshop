from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import datetime

from db.models.user import Gender

class UserSummary(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    home_phone: Optional[str]
    phone_number: str
    gender: Optional[Gender]
    email_verified: bool
    created_at: datetime
    updated_at: datetime
    shipping_address: "AddressSummary"
    billing_address: "AddressSummary"
    orders: List["OrderSummary"]
    wishlist = "WishlistSummary"

    class Config:
        orm_mode = True

from db.schemas.address import AddressSummary
from db.schemas.order import OrderSummary
from db.schemas.wishlist import WishlistSummary
UserSummary.model_rebuild()