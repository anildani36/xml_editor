import logging
from fastapi import HTTPException
from passlib.hash import bcrypt

from src.enums.token_type_enum import TokenType
from src.exceptions.NoUserFoundException import NoUserFoundException
from src.models.login_request import LoginRequest
from src.models.token_generation import TokenGeneration
from src.service.database.user_db_service import UserDbService
from src.utils.token_utils import create_token, decode_token

logger = logging.getLogger(__name__)

class AuthService:

    def __init__(self, user_db_service: UserDbService):
        self.user_db_service = user_db_service

    def handle_user_login(self, credentials: LoginRequest):
        user = self.user_db_service.get_user_info(credentials.username)
        if not user:
            raise NoUserFoundException("No user found")

        if not bcrypt.verify(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Invalid credentials"
                })

        access_token = create_token(TokenGeneration(
            sub=user.username,
            role=user.role,
            token_type=TokenType.ACCESS,
        ))
        refresh_token = create_token(TokenGeneration(
            sub=user.username,
            role=user.role,
            token_type=TokenType.REFRESH,
        ))

        # Save refresh token in DB
        # db_token = RefreshToken(token=refresh_token, user_id=user.id,
        #                         expires_at=datetime.utcnow() + timedelta(days=7))
        # db.add(db_token)
        # db.commit()

    def handle_user_logout(self, credentials: LoginRequest):
        pass

    def handle_token_refresh(self, credentials: LoginRequest):
        pass

    def handle_user_signup(self, credentials: LoginRequest):
        pass