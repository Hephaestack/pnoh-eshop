# from pydantic import BaseModel
# from uuid import UUID
# from typing import Optional, List
# from datetime import datetime

# from db.models.user import Gender

# class UserSummary(BaseModel):
#     id: UUID
#     first_name: str
#     last_name: str
#     email: str
#     home_phone: Optional[str]
#     phone_number: str
#     gender: Optional[Gender]
#     email_verified: bool
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         from_attributes = True
