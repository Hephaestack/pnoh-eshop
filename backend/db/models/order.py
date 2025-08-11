# import uuid
# from sqlalchemy import Column, ForeignKey, String, DateTime, Float
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from db.database import Base
# from datetime import datetime

# class Order(Base):
#     __tablename__ = "orders"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     total_amount = Column(Float, nullable=False)
#     status = Column(String, default="pending", nullable=False)
#     payment_status = Column(String, default="pending", nullable=False)
#     order_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    
#     user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
#     user = relationship("User", back_populates="orders")

#     shipping_address_id = Column(UUID(as_uuid=True), ForeignKey('addresses.id'), nullable=False)
#     shipping_address = relationship("Address", back_populates="orders")

#     class Config:
#         from_attributes = True
