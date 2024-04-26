from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from src.crud import router as crud
from src.stats import router as stats

app = FastAPI()

app.include_router(crud)
app.include_router(stats)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
