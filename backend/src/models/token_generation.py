from pydantic import BaseModel

from src.enums.token_type_enum import TokenType


class TokenGeneration(BaseModel):
    sub: str
    role: str
    token_type: TokenType
