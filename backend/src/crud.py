from http import HTTPStatus

import requests
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from .conn import collection, countries
from .models import CreateDnsCommand, DnsViewModel

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
    updated_dns = await collection.find_one_and_update(
        {"_id": ObjectId(dns_id)},
        {"$inc": {"access_count": 1}},  # Increment 'access_count' by 1
        return_document=ReturnDocument.AFTER  # Return updated document
    )
    if not updated_dns:
        raise HTTPException(status_code=404, detail="dns not found")
    updated_dns["_id"] = str(updated_dns
                             ["_id"])
    return updated_dns


@router.get("/dns")
async def get_list_of_dns(page: int = 0, size: int = 10, search: str = None):
    cursor = (
        collection.find({"domain": {"$regex": f".*{search}.*"}} if search else {})
        .sort("updated_at", -1)
        .skip(page * size)
        .limit(size)
    )

    dns_list = []
    async for dns in cursor:
        dns["_id"] = str(dns["_id"])
        dns_list.append(dns)

    count = await collection.count_documents(
        {"domain": {"$regex": f".*{search}.*"}} if search else {}
    )
    return {"dnses": dns_list, "total_count": count}


@router.get("/country")
async def get_list_of_country(page: int = 0, size: int = 10, search: str = None):
    cursor = (
        countries.find({"name": {"$regex": f".*{search}.*"}} if search else {})
        .skip(page * size)
        .limit(size)
    )

    countries_list = []
    async for c in cursor:
        c["_id"] = str(c["_id"])
        countries_list.append(c)

    return {"countries": countries_list}


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
    return updated_dns


@router.delete("/dns/{dns_id}")
async def delete_dns(dns_id: str):
    deleted_dns = await collection.find_one_and_delete({"_id": ObjectId(dns_id)})
    if not deleted_dns:
        raise HTTPException(status_code=404, detail="dns not found")


@router.get("/add_countries")
async def add_country():
    res = requests.get("https://restcountries.com/v3.1/all")
    for c in res.json():
        await countries.insert_one({"name": c['name']['common']})
