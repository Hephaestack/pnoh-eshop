from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
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
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
