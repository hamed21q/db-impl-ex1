from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CreateDnsCommand(BaseModel):
    domain: str
    ip: str
    updated_at: Optional[datetime] = datetime.utcnow()

    def model_dump(self, *args, **kwargs):
        model = super().model_dump(*args, **kwargs)
        model['updated_at'] = int(datetime.utcnow().timestamp())
        return model


class DnsViewModel(BaseModel):
    id: str = Field(alias="_id")
    domain: str
    ip: str
