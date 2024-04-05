from pydantic import BaseModel, Field


class CreateDnsCommand(BaseModel):
    domain: str = Field(
        pattern="^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+)(?:\/.*)?$",
        examples=["www.ali.gov", "http://www.hossein.com", "https://reza.ir"],
    )
    ip: str = Field(
        pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", examples=["192.168.120.548"]
    )


class DnsViewModel(BaseModel):
    id: str = Field(alias="_id")
    domain: str
    ip: str
