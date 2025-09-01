from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from core.db import SessionLocal
from core.config import settings
from models.document import Contract, Document

router = APIRouter()

class ContractResponse(BaseModel):
    id: int
    booking_id: int
    template_id: str | None = None
    version: int
    status: str
    file_url: str | None = None

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    owner_id: int
    owner_type: str
    document_type: str
    file_url: str
    extra_data: str | None = None

    class Config:
        from_attributes = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/contracts", response_model=List[ContractResponse])
def get_contracts(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    return contracts

@router.post("/contracts/{contract_id}/sign")
def sign_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    contract.status = "signed" # Assuming a simple status update
    db.commit()
    db.refresh(contract)
    return {"status": "contract signed", "contract_id": contract.id}

@router.post("/documents/upload", response_model=DocumentResponse)
def upload_document(
    owner_id: int = Form(...),
    owner_type: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Placeholder for S3 upload logic - in a real app, this would return a presigned URL
    # and the frontend would upload directly to S3. Here, we simulate the upload.
    fake_file_url = f"https://{settings.s3_bucket}.s3.amazonaws.com/{file.filename}"

    # Create a dummy document record
    new_document = Document(
        owner_id=owner_id,
        owner_type=owner_type,
        document_type=document_type,
        file_url=fake_file_url,
        extra_data=f'{{"original_filename": "{file.filename}", "content_type": "{file.content_type}"}}',
    )
    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return new_document
