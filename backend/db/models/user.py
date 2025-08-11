# import uuid
# import enum
# from sqlalchemy import Column, DateTime, String, Enum, Boolean
# from sqlalchemy.orm import relationship
# from sqlalchemy.dialects.postgresql import UUID
# from datetime import datetime
# from zoneinfo import ZoneInfo
# from db.database import Base

# class Gender(str, enum.Enum):
#     male = "Άνδρας"
#     female = "Γυναίκα"
#     other = "Άλλο"
#     prefer_not_to_say = "Προτιμώ να μην πω"

# class User(Base):
#     __tablename__ = "users"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     first_name = Column(String, nullable=False)
#     last_name = Column(String, nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     home_phone = Column(String(20))
#     phone_number = Column(String(20), unique=True, nullable=False)
#     gender = Column(Enum(Gender), nullable=False)
#     email_verified = Column(Boolean, default=False)

#     created_at = Column(DateTime, default=lambda: datetime.now(ZoneInfo("Europe/Athens")))
#     updated_at = Column(DateTime, default=lambda: datetime.now(ZoneInfo("Europe/Athens")), onupdate=lambda: datetime.now(ZoneInfo("Europe/Athens")))

#     addresses = relationship("Address", back_populates="user")

#     @property
#     def shipping_address(self):
#         return next((addr for addr in self.addresses if addr.address_type == "shipping"), None)

#     @property
#     def billing_address(self):
#         return next((addr for addr in self.addresses if addr.address_type == "billing"), None)

#     orders = relationship("Order", back_populates="user")
#     wishlist = relationship("Wishlist", back_populates="user")
#     cart = relationship("Cart", back_populates="user")

#     class Config:
#         from_attributes = True
