import logging

from src.models.login_request import LoginRequest
from src.models.signup_request import SignupRequest
from src.models.token_refresh_request import TokenRefreshRequest
from src.service.auth_service import AuthService

logger = logging.getLogger(__name__)


class AuthController:

    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def handle_login(self, credentials: LoginRequest):
        return self.auth_service.handle_user_login(credentials)

    def handle_logout(self, logout_request: TokenRefreshRequest):
        return self.auth_service.handle_user_logout(logout_request)

    def handle_signup(self, signup_request: SignupRequest):
        return self.auth_service.handle_user_signup(signup_request)

    def handle_token_refresh(self, token_refresh_request: TokenRefreshRequest):
        return self.auth_service.handle_user_token_refresh(token_refresh_request)

    def handle_introspect(self, introspect_request: TokenRefreshRequest):
        return self.auth_service.handle_introspect_call(introspect_request)