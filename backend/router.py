from http import HTTPStatus

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError

from backend.conn import collection
from backend.models import CreateDnsCommand, DnsViewModel

router = APIRouter()


@router.post("/dns")
async def create_dns(command: CreateDnsCommand):
    try:
        result = await collection.insert_one(command.model_dump())
        return str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Duplicate")


@router.get("/dns/{dns_id}", response_model=DnsViewModel)
async def read_dns(dns_id: str):
    cursor = collection.find({"_id": ObjectId(dns_id)})
    async for dns in cursor:
        dns["_id"] = str(dns["_id"])
        return dns
    raise HTTPException(status_code=HTTPStatus.NOT_FOUND)


@router.get("/dns")
async def get_list_of_dns(page: int = 0, size: int = 10, search: str = None):
    cursor = (
        collection.find({"domain": {"$regex": f".*{search}.*"}} if search else {})
        .sort("updated_at", -1)
        .skip((page) * size)
        .limit(size)
    )

    dnses = []
    async for dns in cursor:
        dns["_id"] = str(dns["_id"])
        dnses.append(dns)

    count = await collection.count_documents(
        {"domain": {"$regex": f".*{search}.*"}} if search else {}
    )
    return {"dnses": dnses, "total_count": count}


@router.get("/is_exists")
async def is_exists(domain_name: str):
    cursor = collection.find({"domain": domain_name})
    async for dns in cursor:
        dns["_id"] = str(dns["_id"])
        return dns
    raise HTTPException(status_code=HTTPStatus.NOT_FOUND)



@router.put("/dns/{dns_id}")
async def update_dns(dns_id: str, dns: CreateDnsCommand):
    updated_dns = await collection.find_one_and_update(
        {"_id": ObjectId(dns_id)}, {"$set": dns.model_dump()}
    )
    if not updated_dns:
        raise HTTPException(status_code=404, detail="dns not found")


@router.delete("/dns/{dns_id}")
async def delete_dns(dns_id: str):
    deleted_dns = await collection.find_one_and_delete({"_id": ObjectId(dns_id)})
    if not deleted_dns:
        raise HTTPException(status_code=404, detail="dns not found")
