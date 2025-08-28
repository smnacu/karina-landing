from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AppSettings(BaseModel):
    default_deposit_percentage: float
    coverage_zones: list[str]

@router.get("/", response_model=AppSettings)
def get_settings():
    # Placeholder for actual settings retrieval
    return {
        "default_deposit_percentage": 0.30,
        "coverage_zones": ["AMBA", "La Plata"]
    }

@router.put("/", response_model=AppSettings)
def update_settings(settings: AppSettings):
    # Placeholder for actual settings update
    return settings
