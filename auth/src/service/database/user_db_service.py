import logging
from functools import lru_cache

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette import status

from src.constants.constants import Constants
from src.exceptions.NoUserFoundException import NoUserFoundException
from src.schemas.users import Users

logger = logging.getLogger(__name__)


class UserDbService:

    def __init__(self, db: Session):
        self.db = db

    @lru_cache(maxsize=50)
    def get_user(self, username: str):
        try:
            user = self.db.query(Users).filter(Users.username == username).first()
            if user is None:
                raise NoUserFoundException("No user found")

            return user

        except SQLAlchemyError as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.DB_ERROR
            )

        except Exception as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.GENERAL_ERROR
            )

    @lru_cache(maxsize=50)
    def get_user_using_email(self, email: str):
        try:
            user = self.db.query(Users).filter(Users.email_id == email).first()

            return user

        except SQLAlchemyError as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.DB_ERROR
            )

        except Exception as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.GENERAL_ERROR
            )

    def get_existing_usernames_for_prefix(self, prefix: str):
        try:
            return self.db.scalars(self.db.query(Users.username).filter(Users.username.like(f"{prefix}%"))).all()

        except SQLAlchemyError as e:
            logger.exception(f"Error while getting username list: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.DB_ERROR
            )

        except Exception as e:
            logger.exception(f"Error while getting username list: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.GENERAL_ERROR
            )

    def save_user(self, user: Users):
        try:
            self.db.add(user)
            self.db.commit()

        except SQLAlchemyError as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.DB_ERROR
            )

        except Exception as e:
            logger.exception(f"Error while getting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail= Constants.GENERAL_ERROR
            )
