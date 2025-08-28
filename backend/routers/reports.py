from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class OverviewReport(BaseModel):
    total_leads: int
    confirmed_bookings: int
    total_revenue: float

@router.get("/overview", response_model=OverviewReport)
def get_overview_report():
    # Placeholder for actual report generation logic
    return {
        "total_leads": 100,
        "confirmed_bookings": 50,
        "total_revenue": 150000.00
    }
