from fastapi import APIRouter

from backend.src.conn import collection

router = APIRouter()


@router.get("/stat/business")
async def business_stat():
    pipeline = [
        {
            "$group": {
                "_id": "$business_type",
                "count": {"$sum": 1}
            }
        },
        {
            "$project": {
                "_id": 0,
                "business": "$_id",
                "count": 1
            }
        },
        {
            "$sort": {"count": -1}
        }
    ]
    res = []
    async for doc in collection.aggregate(pipeline):
        res.append(doc)
    return res


@router.get("/stat/country")
async def country_stat():
    pipeline = [
        {
            "$group": {
                "_id": "$country",
                "count": {"$sum": 1}
            }
        },
        {
            "$project": {
                "_id": 0,
                "country": "$_id",
                "count": 1
            }
        },
        {
            "$sort": {"count": -1}
        },
        {
            "$limit": 5

        }
    ]
    res = []
    async for doc in collection.aggregate(pipeline):
        res.append(doc)
    return res


@router.get("/stat/owner")
async def owner_stat():
    pipeline = [
        {
            "$group": {
                "_id": "$owner",
                "count": {"$sum": 1}
            }
        },
        {
            "$project": {
                "_id": 0,
                "owner": "$_id",
                "count": 1
            }
        },
        {
            "$sort": {"count": -1}
        },
        {
            "$limit": 5

        }
    ]
    res = []
    async for doc in collection.aggregate(pipeline):
        res.append(doc)
    return res


@router.get("/stat/domain")
async def domain_stat():
    pipeline = [
        {
            "$project": {
                "tld": {
                    "$arrayElemAt": [
                        {"$split": ["$domain", "."]}, -1]
                }
            }
        },
        {
            "$group": {
                "_id": "$tld",
                "count": {"$sum": 1}
            }
        },
        {
            "$project": {
                "_id": 0,
                "domain": "$_id",
                "count": 1
            }
        },
        {
            "$sort": {"count": -1}
        }
    ]
    res = []
    async for doc in collection.aggregate(pipeline):
        res.append(doc)
    return res


@router.get("/stat/access")
async def access_stat():
    pipeline = [
        {
            "$project": {
                "_id": 0,
                "domain": "$domain",
                "access_count": "$access_count"
            }
        },
        {'$sort': {'access_count': -1}},
        {'$limit': 5}
    ]
    res = []
    async for doc in collection.aggregate(pipeline):
        res.append(doc)
    return res