from pydantic import BaseModel, Field

class SignupRequest(BaseModel):
    firstname: str = Field(..., alias="firstName")
    lastname: str = Field(..., alias="lastName")
    email: str
    password: str
