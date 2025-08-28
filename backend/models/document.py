import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from core.db import Base
from .event import Booking

class ContractStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    SIGNED = "signed"
    CANCELLED = "cancelled"

class DocumentOwnerType(str, enum.Enum):
    PROVIDER = "provider"
    CLIENT = "client"
    EVENT = "event"

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    template_id = Column(String) # Identifier for the template used
    version = Column(Integer, default=1)
    status = Column(Enum(ContractStatus), default=ContractStatus.DRAFT, nullable=False)
    file_url = Column(String)
    signed_at = Column(DateTime)

    booking = relationship("Booking")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, nullable=False)
    owner_type = Column(Enum(DocumentOwnerType), nullable=False)
    document_type = Column(String) # e.g., 'DNI', 'CUIT'
    file_url = Column(String, nullable=False)
    extra_data = Column(Text) # JSON string for extra info

class ContractTemplate(Base):
    __tablename__ = "contract_templates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    content = Column(Text, nullable=False)
