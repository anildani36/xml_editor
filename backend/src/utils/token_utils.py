from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

from src.config.app_config import get_configs
from src.constants.constants import Constants
from src.enums.token_type_enum import TokenType
from src.exceptions.TokenDecodeException import TokenDecodeException
from src.exceptions.TokenGenerationException import TokenGenerationException
from src.models.token_generation import TokenGeneration

PRIVATE_KEY = get_configs().private_key
PUBLIC_KEY = get_configs().public_key

def create_token(data: TokenGeneration):
    to_encode = data.model_dump()
    try:
        expire = datetime.now(timezone.utc) + timedelta(minutes=Constants.ACCESS_TOKEN_EXPIRE_MINUTES) \
            if data.token_type == TokenType.ACCESS \
            else datetime.now(timezone.utc) + timedelta(days=Constants.REFRESH_TOKEN_EXPIRE_DAYS)

        to_encode.pop('token_type')
        to_encode.update({
            "exp": expire,
            "scope": TokenType.REFRESH.value if data.token_type == TokenType.REFRESH else TokenType.ACCESS.value
        })

        return jwt.encode(to_encode, PRIVATE_KEY, algorithm=Constants.ALGORITHM)
    except JWTError as e:
        print(e)
        raise TokenGenerationException(f"Error while creating token: {to_encode}")

def decode_token(token: str):
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=[Constants.ALGORITHM])

        return payload
    except JWTError:
        raise TokenDecodeException(f"Error while decoding token: {token}")
