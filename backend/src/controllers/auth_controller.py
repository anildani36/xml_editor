import logging

from src.models.login_request import LoginRequest
from src.models.signup_request import SignupRequest
from src.service.auth_service import AuthService

logger = logging.getLogger(__name__)


class AuthController:

    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def handle_login(self, credentials: LoginRequest):
        return self.auth_service.handle_user_login(credentials)

    def handle_logout(self, username: str):
        pass

    def handle_signup(self, signup_request: SignupRequest):
        return self.auth_service.handle_user_signup(signup_request)
