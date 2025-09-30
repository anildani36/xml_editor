from typing import Annotated

from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Body, Depends

from src.controllers.auth_controller import AuthController
from src.injection.container import Application
from src.models.login_request import LoginRequest

auth_router = APIRouter(tags=["Authentication"])



@auth_router.post("/login")
@inject
def login(
        request: Annotated[LoginRequest, Body()],
        auth_controller: AuthController = Depends(Provide[Application.services.auth_controller])):
    return auth_controller.handle_login(request)

# @auth_router.post("/logout")
# @inject
# def logout():
#     pass
#
# @auth_router.post("/token/access_token")
# @inject
# def get_access_token():
#     pass
#
# @auth_router.post("/token/refresh_token")
# @inject
# def get_refresh_token():
#     pass

