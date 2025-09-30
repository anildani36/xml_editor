import os
import pathlib
from functools import lru_cache
from pydantic_settings import SettingsConfigDict, BaseSettings
from src.enums.env_enum import Env

import logging

logger = logging.getLogger(__name__)
DEV_CONFIG_FILE = str(pathlib.Path().joinpath('.env.dev'))
PRODUCTION_CONFIG_FILE = str(pathlib.Path().joinpath('.env.prod'))


class AppConfig(BaseSettings):
    env_name: Env
    db_connection_string: str
    private_key: str
    public_key: str

    model_config = SettingsConfigDict(
        env_file=PRODUCTION_CONFIG_FILE if os.getenv('ENV_NAME') == 'prod' else DEV_CONFIG_FILE,
        extra='ignore'  # Allow extra fields in env file
    )
    logger.debug(f'env_file: {DEV_CONFIG_FILE}')
@lru_cache
def get_configs():

    return AppConfig()