
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi import Request

from src.exceptions.NoUserFoundException import NoUserFoundException


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