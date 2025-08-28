from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from core.db import SessionLocal
from models.inventory import Equipment, EquipmentAssignment

router = APIRouter()

class EquipmentResponse(BaseModel):
    id: int
    name: str
    category: str | None = None
    status: str

    class Config:
        from_attributes = True

class EquipmentAssignmentResponse(BaseModel):
    id: int
    event_id: int
    equipment_id: int

    class Config:
        from_attributes = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/equipment", response_model=List[EquipmentResponse])
def get_equipment(db: Session = Depends(get_db)):
    equipment = db.query(Equipment).all()
    return equipment

@router.get("/assignments", response_model=List[EquipmentAssignmentResponse])
def get_assignments(db: Session = Depends(get_db)):
    assignments = db.query(EquipmentAssignment).all()
    return assignments
