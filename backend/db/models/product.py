import uuid
import enum
from sqlalchemy import Column, String, Float, Integer, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from zoneinfo import ZoneInfo

from db.database import Base

class Category(str, enum.Enum):
    rings = "rings"
    earrings = "earrings"
    bracelets = "bracelets"
    necklaces = "necklaces"

class SubCategory(str, enum.Enum):
    ethnic = "ethnic"
    one_of_a_kind = "one of a kind"
    minimal = "minimal"
    luxury = "luxury"

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    category = Column(Enum(Category, name="category"), nullable=True)
    sub_category = Column(Enum(SubCategory, name="Subcategory"), nullable=True)
    image_url = Column(ARRAY(String), nullable=True)
    big_image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(ZoneInfo("Europe/Athens")), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(ZoneInfo("Europe/Athens")), onupdate=datetime.now(ZoneInfo("Europe/Athens")), nullable=False)

    cart_items = relationship("CartItem", back_populates="product")
    # order_items = relationship("OrderItem", back_populates="product")

    class Config:
        from_attributes = True
