# import uuid
# from sqlalchemy import Column, String, ForeignKey
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from db.database import Base

# class Address(Base):
#     __tablename__ = "addresses"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     address_line1 = Column(String, nullable=False)
#     address_line2 = Column(String, nullable=True)
#     city = Column(String, nullable=False)
#     state = Column(String, nullable=False)
#     postal_code = Column(String, nullable=False)
#     country = Column(String, nullable=False)

#     user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
#     user = relationship("User", back_populates="addresses", uselist=False)
#     orders = relationship("Order", back_populates="shipping_address")

#     address_type = Column(String, nullable=False, default="shipping")

#     class Config:
#         from_attributes = True
