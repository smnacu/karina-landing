from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from core.db import SessionLocal

router = APIRouter()

class Package(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/packages", response_model=List[Package])
def get_packages(db: Session = Depends(get_db)):
    return []

@router.get("/addons")
def get_addons(db: Session = Depends(get_db)):
    return []

@router.get("/pricing")
def get_pricing_rules(db: Session = Depends(get_db)):
    return []
