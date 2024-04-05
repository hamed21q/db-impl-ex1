from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://root:1qaz@localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
database = client["db_imp"]
collection = database["dns"]

collection.create_index("ip", unique=True)
collection.create_index("domain", unique=True)
collection.create_index({"domain": "text"})