import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship
from core.db import Base
from .user import User

class LeadStatus(str, enum.Enum):
    NEW = "new"
    QUOTED = "quoted"
    PENDING_DEPOSIT = "pending_deposit"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class EventStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class BookingStatus(str, enum.Enum):
    PENDING_DEPOSIT = "pending_deposit"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    contact_phone = Column(String)
    event_type = Column(String)
    event_date = Column(DateTime)
    event_location = Column(String)
    num_guests = Column(Integer)
    interested_services = Column(Text)
    message = Column(Text)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW, nullable=False)
    source = Column(String) # e.g., utm_source

class Quote(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    client_id = Column(Integer, ForeignKey("users.id"))
    price_ars = Column(Integer, nullable=False) # In ARS cents
    deposit_payment_link = Column(String)
    total_payment_link = Column(String)
    # package/addons relationship to be added

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)
    date = Column(DateTime, nullable=False)
    location = Column(String)
    duration_hours = Column(Float)
    status = Column(Enum(EventStatus), default=EventStatus.SCHEDULED, nullable=False)
    notes = Column(Text)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    total_price_ars = Column(Integer, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING_DEPOSIT, nullable=False)
    # package/addons relationship to be added

    client = relationship("User")
    event = relationship("Event")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    type = Column(String) # 'deposit' or 'total'
    mp_preference_id = Column(String)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    amount_ars = Column(Integer, nullable=False)

    booking = relationship("Booking")
