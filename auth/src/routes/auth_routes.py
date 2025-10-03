from typing import Annotated

from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Body, Depends

from src.controllers.auth_controller import AuthController
from src.injection.container import Application
from src.models.login_request import LoginRequest
from src.models.signup_request import SignupRequest
from src.models.token_refresh_request import TokenRefreshRequest

auth_router = APIRouter(tags=["Authentication"])



@auth_router.post("/login", summary="Login", description="Login with username and password")
@inject
def login(
        request: Annotated[LoginRequest, Body()],
        auth_controller: AuthController = Depends(Provide[Application.services.auth_controller])):
    return auth_controller.handle_login(request)

@auth_router.post("/logout", summary="Logout", description="Logout from application")
@inject
def logout(request: Annotated[TokenRefreshRequest, Body()],
        auth_controller: AuthController = Depends(Provide[Application.services.auth_controller])):
    return auth_controller.handle_logout(request)

@auth_router.post("/signup", summary="Signup", description="Signup for application")
@inject
def signup(request: Annotated[SignupRequest, Body()],
        auth_controller: AuthController = Depends(Provide[Application.services.auth_controller])):
    return auth_controller.handle_signup(request)

@auth_router.post("/token/refresh", summary="Refresh access token", description="Refresh access token for user")
@inject
def issue_token(request: Annotated[SignupRequest, Body()],
        auth_controller: AuthController = Depends(Provide[Application.services.auth_controller])):
    return auth_controller.handle_token_refresh(request)

@auth_router.post("/introspect", summary="Introspect API", description="Introspect API to authenticate user")
@inject
def introspect(request: Annotated[TokenRefreshRequest, Body()],
        auth_controller: AuthController = Depends(Provide[Application.services.auth_controller])):
    return auth_controller.handle_introspect(request)