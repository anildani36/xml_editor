import logging
from functools import lru_cache

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.testing.pickleable import User
from starlette import status

from src.constants.constants import Constants
from src.exceptions.NoRefreshTokenFoundException import NoRefreshTokenFoundException
from src.schemas.refresh_tokens import RefreshToken
from src.schemas.users import Users

logger = logging.getLogger(__name__)


class RefreshTokenDbService:

    def __init__(self, db: Session):
        self.db = db

    @lru_cache(maxsize=100)
    def get_refresh_token(self, token: str) -> RefreshToken:
        try:
            refresh_token = self.db.query(RefreshToken).filter(RefreshToken.token == token).first()
            if refresh_token is None:
                raise NoRefreshTokenFoundException(Constants.SESSION_EXPIRED)

            return refresh_token

        except SQLAlchemyError as e:
            logger.exception(f"Error while getting refresh token data: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.DB_ERROR
            )

        except Exception as e:
            logger.exception(f"Error while getting refresh token data: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.GENERAL_ERROR
            )

    def save_refresh_token(self, token: RefreshToken):
        try:
            self.db.add(token)
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
                detail=Constants.GENERAL_ERROR
            )

    def delete_refresh_token(self, token: str):
        try:
            self.db.query(RefreshToken).filter(RefreshToken.token == token.token).delete(RefreshToken)
            self.db.commit()

        except SQLAlchemyError as e:
            logger.exception(f"Error while deleting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.DB_ERROR
            )

        except Exception as e:
            logger.exception(f"Error while deleting user info: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=Constants.GENERAL_ERROR
            )

