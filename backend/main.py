from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from starlette.middleware.cors import CORSMiddleware

from backend.router import router

app = FastAPI()

app.include_router(router)

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
