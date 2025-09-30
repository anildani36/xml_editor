import logging

from src.config.app_config import get_configs
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger(__name__)

DATABASE_URL = get_configs().db_connection_string

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    logger.info("Connecting to database...")
    db = SessionLocal()
    try:
        yield db
    finally:
        logger.info("Disconnecting from database...")
        db.close()