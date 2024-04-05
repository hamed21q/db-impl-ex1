from pathlib import Path

from pydantic_settings import BaseSettings

PROJECT_DIR = Path(__file__).parent


class Settings(BaseSettings):
    MONGO_USERNAME: str
    MONGO_PASSWORD: str
    MONGO_HOST: str
    MONGO_PORT: str

    class Config:
        env_file = f"{PROJECT_DIR}/.env"
        case_sensitive = True
        extra = "allow"


setting = Settings()