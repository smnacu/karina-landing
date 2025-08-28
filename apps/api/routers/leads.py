from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

from core.db import SessionLocal
from models.event import Lead as DBLead
from models.event import LeadStatus

router = APIRouter()

class LeadCreate(BaseModel):
    contact_name: str
    contact_email: str
    contact_phone: str | None = None
    event_type: str | None = None
    event_date: datetime | None = None
    event_location: str | None = None
    num_guests: int | None = None
    interested_services: str | None = None
    message: str | None = None

class LeadResponse(LeadCreate):
    id: int
    status: LeadStatus
    event_date: datetime | None = None
    event_location: str | None = None
    num_guests: int | None = None
    interested_services: str | None = None

    class Config:
        from_attributes = True # Use from_attributes instead of orm_mode for Pydantic v2

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=LeadResponse)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    db_lead = DBLead(**lead.model_dump())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/", response_model=List[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    leads = db.query(DBLead).all()
    return leads

@router.post("/{lead_id}/notes")
def add_note_to_lead(lead_id: int, note: dict, db: Session = Depends(get_db)):
    # Placeholder
    return {"status": "note added"}

@router.put("/{lead_id}/status")
def update_lead_status(lead_id: int, status: dict, db: Session = Depends(get_db)):
    # Placeholder
    return {"status": "status updated"}
