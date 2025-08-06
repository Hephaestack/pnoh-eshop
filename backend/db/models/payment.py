from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False)
    payment_method = Column(String, nullable=False)  # e.g., 'Credit Card', 'PayPal'
    payment_status = Column(String, default="pending", nullable=False)
    amount = Column(Float, nullable=False)
    transaction_id = Column(String, nullable=True)
    payment_date = Column(DateTime, default=datetime.now(), nullable=False)

    order = relationship("Order", back_populates="payment")

    class Config:
        orm_mode = True
