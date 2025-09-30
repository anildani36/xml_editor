from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from src.config.db_connection_config import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    token = Column(String)
    expires_at = Column(DateTime, default=datetime.utcnow)
