from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from core.db import SessionLocal
from models.document import ContractTemplate

router = APIRouter()

class ContractTemplateResponse(BaseModel):
    id: str
    name: str
    content: str

    class Config:
        from_attributes = True

class ContractTemplateCreate(BaseModel):
    id: str
    name: str
    content: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ContractTemplateResponse])
def get_contract_templates(db: Session = Depends(get_db)):
    templates = db.query(ContractTemplate).all()
    return templates

@router.post("/", response_model=ContractTemplateResponse)
def create_contract_template(template: ContractTemplateCreate, db: Session = Depends(get_db)):
    db_template = ContractTemplate(**template.model_dump())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template
