from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field


class CreateDnsCommand(BaseModel):
    domain: str
    ip: str
    country: str
    owner: str
    business_type: Optional[
        Literal["news", "ecommerce", "education", "government", "social", "others"]
    ] = "others"
    updated_at: Optional[datetime] = datetime.utcnow()
    access_count: Optional[int] = 0

    def model_dump(self, *args, **kwargs):
        model = super().model_dump(*args, **kwargs)
        model['updated_at'] = int(datetime.utcnow().timestamp())
        return model


class DnsViewModel(BaseModel):
    id: str = Field(alias="_id")
    domain: str
    ip: str
    business_type: str
    owner: str
    country: str
