import uuid
import enum
from sqlalchemy import Column, String, DateTime, Numeric, Enum, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import datetime
from zoneinfo import ZoneInfo

class OrderStatus(str, enum.Enum):
    pending = "pending"
    sent = "sent"
    fulfilled = "fulfilled"
    cancelled = "cancelled"
    paid = "paid"

class PaymentStatus(str, enum.Enum):
    pending   = "pending"
    succeeded = "succeeded"
    failed    = "failed"
    refunded  = "refunded"
    partial   = "partial_refund"

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    user_id = Column(String, nullable=True)
    guest_session_id = Column(String, nullable=True)
    email = Column(String, nullable=True)

    currency = Column(String(), nullable=False, default="eur")
    subtotal_amount = Column(Numeric(10, 2), nullable=False, default=0)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0)
    shipping_amount = Column(Numeric(10, 2), nullable=False, default=0)
    tax_amount = Column(Numeric(10, 2), nullable=False, default=0)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0)

    status = Column(Enum(OrderStatus, name="order_status"), nullable=False, default=OrderStatus.pending)
    payment_status = Column(Enum(PaymentStatus, name="payment_status"), nullable=False, default=PaymentStatus.pending)

    stripe_payment_intent_id = Column(String, nullable=True)
    stripe_checkout_session_id = Column(String, nullable=True)

    shipping_name = Column(String, nullable=True)
    shipping_phone = Column(String, nullable=True)
    shipping_address_line1 = Column(String, nullable=True)
    shipping_address_line2 = Column(String, nullable=True)
    shipping_city = Column(String, nullable=True)
    shipping_state = Column(String, nullable=True)
    shipping_postal_code = Column(String, nullable=True)
    shipping_country = Column(String(2), nullable=True)
    shipping_method = Column(String, nullable=True)
    shipping_rate_id = Column(String, nullable=True)

    billing_name = Column(String, nullable=True)
    billing_address_line1 = Column(String, nullable=True)
    billing_address_line2 = Column(String, nullable=True)
    billing_city = Column(String, nullable=True)
    billing_state = Column(String, nullable=True)
    billing_postal_code = Column(String, nullable=True)
    billing_country = Column(String(2), nullable=True)

    customer_details = Column(JSON, nullable=True)
    shipping_details = Column(JSON, nullable=True)
    extra_metadata = Column("metadata", JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.now(ZoneInfo("Europe/Athens")), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(ZoneInfo("Europe/Athens")), onupdate=datetime.now(ZoneInfo("Europe/Athens")), nullable=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_orders_user_id_created_at", "user_id", "created_at"),
        Index("ix_orders_status_created_at", "status", "created_at"),
        Index("ix_orders_session", "stripe_checkout_session_id"),
    )
