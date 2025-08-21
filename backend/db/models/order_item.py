import uuid
from sqlalchemy import Column, String, Numeric, Integer, ForeignKey

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)

    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)

    product_name  = Column(String, nullable=False)
    product_sku   = Column(String, nullable=True)
    product_image = Column(String, nullable=True)

    unit_amount = Column(Numeric(10, 2), nullable=False)
    quantity    = Column(Integer, nullable=False, default=1)
    line_total  = Column(Numeric(10, 2), nullable=False)

    order   = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
