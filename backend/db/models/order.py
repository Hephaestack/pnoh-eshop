import uuid
from sqlalchemy import Column, String, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from db.database import Base

class Order(Base):
    __tablename__ = "order"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending", nullable=False)
    payment_status = Column(String, default="pending", nullable=False)
    order_date = Column(DateTime, default=datetime.now(), nullable=False)
    
    user_id = Column(UUID(as_uuid=True), ForeignKey='users.id', nullable=False)
    user = relationship("User", back_populates="orders")
    shipping_address = relationship("Address", back_populates="orders", uselist=False)
    order_items = relationship("OrderItem", back_populates="orders", cascade="all, delete-orphan")

    class Config:
        orm_mode = True
