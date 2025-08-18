import uuid
from sqlalchemy import Column, String, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from db.database import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=True)
    guest_session_id = Column(String, nullable=True)

    __table_args__ = (
        CheckConstraint(
            'user_id IS NOT NULL OR guest_session_id IS NOT NULL',
            name='ck_cart_user_or_guest'
        ),
    )

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
