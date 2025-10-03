from pydantic import BaseModel

from src.enums.token_type_enum import TokenType


class TokenRefreshRequest(BaseModel):
    token: str
    token_type: TokenType