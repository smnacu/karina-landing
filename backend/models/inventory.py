import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from core.db import Base
from .event import Event

class EquipmentStatus(str, enum.Enum):
    AVAILABLE = "available"
    IN_USE = "in_use"
    MAINTENANCE = "maintenance"
    MISSING = "missing"

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String) # e.g., 'Audio', 'Lighting'
    status = Column(Enum(EquipmentStatus), default=EquipmentStatus.AVAILABLE, nullable=False)

class EquipmentAssignment(Base):
    __tablename__ = "equipment_assignments"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)

    event = relationship("Event")
    equipment = relationship("Equipment")

class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("equipment_assignments.id"), nullable=False)
    name = Column(String, nullable=False)
    checked_out = Column(Boolean, default=False)
    checked_in = Column(Boolean, default=False)

    assignment = relationship("EquipmentAssignment")
