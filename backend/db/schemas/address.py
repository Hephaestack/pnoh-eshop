from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class AddressSummary(BaseModel):
    id: UUID
    address_line1: str
    address_line2: Optional[str]
    city: str
    state: str
    postal_code: str
    country: str
    user: "UserSummary"
    address_type: str

    class Config:
        orm_mode = True

from db.schemas.user import UserSummary
AddressSummary.model_rebuild()