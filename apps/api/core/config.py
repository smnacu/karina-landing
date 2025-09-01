from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/karina_events"
    s3_bucket: str = "fake-s3-bucket"

    class Config:
        env_file = ".env"

settings = Settings()
