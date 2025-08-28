from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from core.db import SessionLocal

router = APIRouter()

class Booking(BaseModel):
    id: int
    client_id: int
    event_id: int

    class Config:
        orm_mode = True

class Event(BaseModel):
    id: int
    event_type: str

    class Config:
        orm_mode = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/events", response_model=List[Event])
def get_events(db: Session = Depends(get_db)):
    return []

@router.get("/bookings", response_model=List[Booking])
def get_bookings(db: Session = Depends(get_db)):
    return []

@router.post("/bookings/{booking_id}/confirm")
def confirm_booking(booking_id: int, db: Session = Depends(get_db)):
    return {"status": "booking confirmed"}

@router.post("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    return {"status": "booking cancelled"}
