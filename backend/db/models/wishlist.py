import uuid
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID

from db.database import Base

class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
