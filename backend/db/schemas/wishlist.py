from pydantic import BaseModel
from uuid import UUID
from typing import List
from datetime import datetime

class WishlistSummary(BaseModel):
    id: UUID
    added_at: datetime
    user: "UserSummary"
    product: List["ProductSummary"]

    class Config:
        orm_mode = True

from db.schemas.user import UserSummary
from db.schemas.product import ProductSummary
WishlistSummary.model_rebuild()