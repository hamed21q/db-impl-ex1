from motor.motor_asyncio import AsyncIOMotorClient

from .core import setting

MONGO_URL = "mongodb://{}:{}@{}:{}".format(
    setting.MONGO_USERNAME,
    setting.MONGO_PASSWORD,
    setting.MONGO_HOST,
    setting.MONGO_PORT,
)
client = AsyncIOMotorClient(MONGO_URL)
database = client["db_imp"]
collection = database["dns"]

collection.create_index("ip", unique=True)
collection.create_index("domain", unique=True)
collection.create_index({"domain": "text"})
