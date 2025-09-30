import logging
from functools import lru_cache

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette import status

from src.exceptions.NoUserFoundException import NoUserFoundException
from src.schemas.users import Users

logger = logging.getLogger(__name__)


class UserDbService:

    def __init__(self, db: Session):
        self.db = db

    @lru_cache(maxsize=50)
    def get_user_info(self, username: str):
        try:
            user_info = self.db.query(Users).filter(Users.username == username).first()
            if user_info is None:
                raise NoUserFoundException("No user found")

            return user_info

        except SQLAlchemyError as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )

        except Exception as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred!"
            )
