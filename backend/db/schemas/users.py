from pydantic import BaseModel, Field

class UpdateNamesBody(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str  = Field(min_length=1, max_length=100)
