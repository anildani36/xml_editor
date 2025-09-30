from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

from src.config.app_config import get_configs
from src.constants.constants import Constants
from src.enums.token_type_enum import TokenType
from src.models.token_generation import TokenGeneration

PRIVATE_KEY = get_configs().private_key
PUBLIC_KEY = get_configs().public_key

def create_token(data: TokenGeneration):
    to_encode = data.model_dump()
    expire = datetime.now(timezone.utc) + timedelta(minutes=Constants.ACCESS_TOKEN_EXPIRE_MINUTES) if data.token_type == TokenType.ACCESS else timedelta(days=Constants.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({
        "exp": expire,
        "scope": TokenType.REFRESH if data.token_type == TokenType.REFRESH else TokenType.ACCESS
    })
    return jwt.encode(to_encode, PRIVATE_KEY, algorithm=Constants.ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=[Constants.ALGORITHM])
        return payload
    except JWTError:
        return None
