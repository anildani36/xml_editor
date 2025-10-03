import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.security import HTTPBearer
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware

from src.config.app_config import get_configs
from src.config.db_connection_config import get_db
from src.exceptions.NoRefreshTokenFoundException import NoRefreshTokenFoundException
from src.exceptions.NoUserFoundException import NoUserFoundException
from src.exceptions.TokenDecodeException import TokenDecodeException
from src.exceptions.TokenGenerationException import TokenGenerationException
from src.exceptions.exception_handlers import (
    sqlalchemy_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    no_user_found_exception_handler,
    no_refresh_token_found_exception_handler,
    token_generation_exception_handler,
    token_decode_exception_handler
)
from src.injection.container import Application
from src.routes.auth_routes import auth_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Application startup
    logger.info('Initializing application and loading dependencies...')
    get_db()
    logger.info(f'Application startup completed for env :: {get_configs().env_name}')
    yield
    # Application Shutdown

app = FastAPI(
    lifespan=lifespan,
    title="Simple Auth Service API",
    description="""
    This is a authentication microservice. 
    On successful login, access token and refresh token are generated for user, access token being short lived (15 min) anf refresh token long lived (7 days). 
    Users can use refresh token to generate new access token. The refresh token will be saved in DB as server-side session and deleted using db trigger after expiration time.
    """,
    version="1.0.0",
    contact={
        "name": "API Support",
        "contact_email": "anildani36@gmail.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

security = HTTPBearer()

# Include Middlewares
# app.add_middleware(ExtractUserInfoCognitoMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register global exception handlers
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(ValueError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(NoUserFoundException, no_user_found_exception_handler)
app.add_exception_handler(NoRefreshTokenFoundException, no_refresh_token_found_exception_handler)
app.add_exception_handler(TokenGenerationException, token_generation_exception_handler)
app.add_exception_handler(TokenDecodeException, token_decode_exception_handler)


# Include all routers
app.include_router(auth_router, prefix="/v1/auth")


# Dependency Injection
container = Application()
container.wire(modules=[__name__])
app.container = container

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", log_config='log_conf.yaml')