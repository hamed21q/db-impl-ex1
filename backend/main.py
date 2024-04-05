from typing import List

from bson import ObjectId
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = "mongodb://root:1qaz@localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
database = client["db_imp"]
collection = database["dns"]

collection.create_index("ip", unique=True)
collection.create_index("domain", unique=True)
collection.create_index({"domain": "text"})


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


@app.post("/dns/")
async def create_dns(command: CreateDnsCommand):
    try:
        result = await collection.insert_one(command.model_dump())
        return str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Duplicate")


@app.get("/dns/{dns_id}", response_model=DnsViewModel)
async def read_dns(dns_id: str):
    dns = await collection.find_one({"_id": ObjectId(dns_id)})
    if dns:
        dns["_id"] = str(dns["_id"])
        return dns
    raise HTTPException(status_code=404, detail="dns not found")


@app.get("/dns")
async def get_list_of_dns(page: int = 0, size: int = 10, search: str = None):

    cursor = collection.find({"domain": {"$regex": f".*{search}.*"}} if search else {}).skip((page) * size).limit(size)

    dnses = []
    async for dns in cursor:
        dns["_id"] = str(dns["_id"])
        dnses.append(dns)

    count = await collection.count_documents({"domain": {"$regex": f".*{search}.*"}} if search else {})
    return {"dnses": dnses, "total_count": count}


@app.put("/dns/{dns_id}")
async def update_dns(dns_id: str, dns: CreateDnsCommand):
    updated_dns = await collection.find_one_and_update(
        {"_id": ObjectId(dns_id)}, {"$set": dns.dict()}
    )
    if not updated_dns:
        raise HTTPException(status_code=404, detail="dns not found")


@app.delete("/dns/{dns_id}")
async def delete_dns(dns_id: str):
    deleted_dns = await collection.find_one_and_delete({"_id": ObjectId(dns_id)})
    if not deleted_dns:
        raise HTTPException(status_code=404, detail="dns not found")

