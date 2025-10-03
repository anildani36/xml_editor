
from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.exceptions.NoRefreshTokenFoundException import NoRefreshTokenFoundException
from src.exceptions.NoUserFoundException import NoUserFoundException
from src.exceptions.TokenDecodeException import TokenDecodeException
from src.exceptions.TokenGenerationException import TokenGenerationException


async def sqlalchemy_exception_handler(exc: SQLAlchemyError):
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc)}
    )

async def validation_exception_handler(exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

async def no_user_found_exception_handler(exc: NoUserFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)}
    )

async def no_refresh_token_found_exception_handler(exc: NoRefreshTokenFoundException):
    return JSONResponse(
        status_code=401,
        content={"detail": str(exc)}
    )

async def token_generation_exception_handler(exc: TokenGenerationException):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

async def token_decode_exception_handler(exc: TokenDecodeException):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

