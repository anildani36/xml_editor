from enum import Enum


class UserRoleEnum(Enum):
    SUPERADMIN = 1
    ADMIN = 2
    EDITOR = 3
    VIEWER = 4