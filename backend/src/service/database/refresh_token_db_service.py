import logging
from functools import lru_cache

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.testing.pickleable import User
from starlette import status
from src.schemas.refresh_tokens import RefreshToken
from src.schemas.users import Users

logger = logging.getLogger(__name__)


class RefreshTokenDbService:

    def __init__(self, db: Session):
        self.db = db

    # @lru_cache(maxsize=100)
    # def get_refresh_token(self, username: str):
    #     try:
    #         user = self.db.query(Users).filter(Users.username == username).first()
    #         if user is None:
    #             raise NoUserFoundException("No user found")
    #
    #         return user
    #
    #     except SQLAlchemyError as e:
    #         logger.exception(f"Error while getting user info: {e}")
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail="Database error occurred"
    #         )
    #
    #     except Exception as e:
    #         logger.exception(f"Error while getting user info: {e}")
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail="An error occurred!"
    #         )

    def save_refresh_token(self, token: RefreshToken):
        try:
            self.db.add(token)
            self.db.commit()

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
