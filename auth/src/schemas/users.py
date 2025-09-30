from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from src.config.db_connection_config import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email_id = Column(String(255), unique=True, nullable=False)
    password = Column(Text, nullable=False)

    role = Column(Integer, ForeignKey("user_roles.id"), nullable=False, index=True)
    user_roles = relationship("UserRoles", back_populates="users")

    created_ts = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_ts = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
