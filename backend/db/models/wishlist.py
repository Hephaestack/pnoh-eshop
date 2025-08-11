# import uuid
# from sqlalchemy import Column, DateTime, ForeignKey
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime

# from db.database import Base

# class Wishlist(Base):
#     __tablename__ = "wishlist"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     added_at = Column(DateTime, default=datetime.now(), nullable=False)

#     user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
#     product_id = Column(UUID(as_uuid=True), ForeignKey('products.id'), nullable=False)

#     user = relationship("User", back_populates="wishlist")
#     product = relationship("Product", back_populates="wishlist")
