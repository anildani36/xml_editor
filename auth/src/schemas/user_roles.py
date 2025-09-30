from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from src.config.db_connection_config import Base


class UserRoles(Base):
    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    created_ts = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("Users", back_populates="user_roles")