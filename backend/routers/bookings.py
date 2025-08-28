from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from core.db import SessionLocal
from models.event import Booking, Event, BookingStatus

router = APIRouter()

class BookingResponse(BaseModel):
    id: int
    client_id: int
    event_id: int
    status: str

    class Config:
        from_attributes = True

class EventResponse(BaseModel):
    id: int
    event_type: str
    status: str

    class Config:
        from_attributes = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return events

@router.get("/bookings", response_model=List[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings

@router.post("/bookings/{booking_id}/confirm", response_model=BookingResponse)
def confirm_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = BookingStatus.CONFIRMED
    db.commit()
    db.refresh(booking)
    return booking

@router.post("/bookings/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = BookingStatus.CANCELLED
    db.commit()
    db.refresh(booking)
    return booking
