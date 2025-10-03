import logging
from http import HTTPStatus

from fastapi import HTTPException
from passlib.context import CryptContext
from passlib.hash import bcrypt
from datetime import datetime, timedelta, timezone

from starlette.responses import JSONResponse

from src.constants.constants import Constants
from src.enums.token_type_enum import TokenType
from src.enums.user_roles_enum import UserRoleEnum
from src.exceptions.NoUserFoundException import NoUserFoundException
from src.models.login_request import LoginRequest
from src.models.signup_request import SignupRequest
from src.models.token_generation import TokenGeneration
from src.models.token_refresh_request import TokenRefreshRequest
from src.schemas.refresh_tokens import RefreshToken
from src.schemas.users import Users
from src.service.database.refresh_token_db_service import RefreshTokenDbService
from src.service.database.user_db_service import UserDbService
from src.utils.token_utils import create_token, decode_token
from src.utils.user_utils import create_username, update_username_with_suffix

logger = logging.getLogger(__name__)

class AuthService:

    def __init__(self, user_db_service: UserDbService,
                 token_db_service: RefreshTokenDbService):
        self.user_db_service = user_db_service
        self.token_db_service = token_db_service

    def handle_user_login(self, credentials: LoginRequest):
        # Get the user info
        user = self.user_db_service.get_user(credentials.username)
        if not user:
            raise NoUserFoundException("No user found")

        # Match the password
        if not bcrypt.verify(credentials.password, user.password):
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail={
                    "message": Constants.INVALID_CREDS,
                })

        # Create the tokens
        access_token = create_token(TokenGeneration(
            sub=user.username,
            role=user.user_roles.name,
            token_type=TokenType.ACCESS,
        ))
        refresh_token = create_token(TokenGeneration(
            sub=user.username,
            role=user.user_roles.name,
            token_type=TokenType.REFRESH,
        ))

        # Save refresh token in DB
        self.token_db_service.save_refresh_token(RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=datetime.now(timezone.utc) + timedelta(days=7)
        ))

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                "data": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                },
                "message": Constants.LOGIN_SUCCESSFUL
            }
        )

    def handle_user_logout(self, logout_request: TokenRefreshRequest):
        if logout_request.token_type == TokenType.REFRESH:
            self.token_db_service.delete_refresh_token(logout_request.token)
        else:
            JSONResponse(
                status_code=HTTPStatus.FORBIDDEN,
                content={
                    "message": Constants.INVALID_TOKEN
            })

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                "message": Constants.LOGOUT_SUCCESSFUL
            })

    def handle_user_token_refresh(self, token_refresh_request: TokenRefreshRequest):
        access_token: str = ""
        if token_refresh_request.token_type == TokenType.REFRESH:
            payload = decode_token(token_refresh_request.token)

            # Check is the session exists, if present generate access token
            if self.token_db_service.get_refresh_token(token_refresh_request.token):
                access_token = create_token(TokenGeneration(
                    sub=payload.sub,
                    role=payload.role,
                    token_type=TokenType.ACCESS,
                ))
            else:
                JSONResponse(
                    status_code=HTTPStatus.UNAUTHORIZED,
                    content={
                        "message": Constants.SESSION_EXPIRED
                    }
                )

        else:
            return JSONResponse(
                status_code=HTTPStatus.FORBIDDEN,
                content={
                    "message": Constants.INVALID_TOKEN
                }
            )

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                "access_token": access_token
            })

    def handle_user_signup(self, signup_request: SignupRequest):
        # Check if email already exists
        existing_user = self.user_db_service.get_user_using_email(signup_request.email)
        if existing_user:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "User already exists for this email"
                }
            )

        # Encrypt password
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_password = pwd_context.hash(signup_request.password)

        # If user does not exist then create username
        username = self.generate_unique_username(lastname=signup_request.lastname, firstname=signup_request.firstname)

        # insert record
        self.user_db_service.save_user(Users(
            username=username,
            email_id=signup_request.email,
            role=UserRoleEnum.VIEWER.value,
            password=hashed_password,
            first_name=signup_request.firstname,
            last_name=signup_request.lastname,
        ))

        # Do not issue token as for successful signups user will be redirected to login screen
        return JSONResponse(
            status_code=200,
            content={
                "message": "Signup successful!!"
            }
        )

    def handle_introspect_call(self, token_refresh_request: TokenRefreshRequest):
        # Decode Token
        if token_refresh_request.token_type == TokenType.ACCESS:
            payload = decode_token(token_refresh_request.token)
        else:
            return JSONResponse(
                status_code=HTTPStatus.FORBIDDEN,
                content={
                    "message": Constants.INVALID_TOKEN
                }
            )

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                "username": payload["sub"],
                "role": payload["role"],
                "expires_at": payload["expires_at"]
            })

    def generate_unique_username(self, firstname: str, lastname: str) -> str:
        # If user does not exist then create username
        username = create_username(lastname=lastname, firstname=firstname)

        ## Fetch all existing usernames with this prefix
        existing_usernames = set(self.user_db_service.get_existing_usernames_for_prefix(username))

        if username not in existing_usernames:
            return username

        return update_username_with_suffix(username=username, existing_usernames=existing_usernames)

