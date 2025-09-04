from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/karina_events"
    s3_bucket: str = "fake-s3-bucket"

    # JWT settings
    jwt_secret: str = "a_very_secret_key"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7 # 1 week

    class Config:
        env_file = ".env"

settings = Settings()
