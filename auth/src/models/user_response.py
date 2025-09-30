from pydantic import BaseModel, Field
from datetime import datetime

class UserRoleBase(BaseModel):
    name: str
    description: str

    class Config:
        orm_mode = True

class UserInfo(BaseModel):
    username: str
    firstName: str = Field(alias="first_name")
    last_name: str
    email_id: str
    user_role: UserRoleBase = Field(alias="user_roles")
    last_updated_ts: datetime

    class Config:
        orm_mode = True
        allow_population_by_field_name = True