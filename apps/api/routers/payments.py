from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import mercadopago
import os

from core.db import SessionLocal
from models.event import Booking, Payment, PaymentStatus

router = APIRouter()

# Initialize Mercado Pago SDK
mp_sdk = mercadopago.SDK(os.environ.get("MP_ACCESS_TOKEN"))

class PaymentPreferenceCreate(BaseModel):
    booking_id: int
    amount: float
    description: str
    payer_email: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/mp/create-preference")
def create_payment_preference(preference_data: PaymentPreferenceCreate, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == preference_data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Create a payment record in our DB first
    new_payment = Payment(
        booking_id=booking.id,
        type="deposit", # Assuming this is for a deposit
        amount_ars=int(preference_data.amount * 100), # Store in cents
        status=PaymentStatus.PENDING
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    preference = {
        "items": [
            {
                "title": preference_data.description,
                "quantity": 1,
                "unit_price": preference_data.amount,
            }
        ],
        "payer": {
            "email": preference_data.payer_email
        },
        "back_urls": {
            "success": "https://your-frontend.com/success", # TODO: Replace with actual frontend URL
            "failure": "https://your-frontend.com/failure", # TODO: Replace with actual frontend URL
            "pending": "https://your-frontend.com/pending", # TODO: Replace with actual frontend URL
        },
        "auto_return": "approved",
        "notification_url": f"https://your-backend.com/payments/webhooks/mp?payment_id={new_payment.id}", # TODO: Replace with actual backend URL
        "external_reference": str(new_payment.id) # Our internal payment ID
    }

    try:
        mp_preference_response = mp_sdk.preference().create(preference)
        mp_preference_id = mp_preference_response["response"]["id"]
        mp_init_point = mp_preference_response["response"]["init_point"]

        # Update our payment record with MP preference ID
        new_payment.mp_preference_id = mp_preference_id
        db.commit()
        db.refresh(new_payment)

        return {"preference_id": mp_preference_id, "init_point": mp_init_point}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Mercado Pago error: {e}")

@router.post("/webhooks/mp")
async def webhook_mercado_pago(request: Request, payment_id: int | None = None, db: Session = Depends(get_db)):
    # Validate webhook signature (TODO: Implement proper signature validation)
    # For now, we'll just process the notification

    data = await request.json()
    print("Mercado Pago Webhook received:", data)

    if data.get("type") == "payment":
        payment_id_mp = data.get("data", {}).get("id")
        if payment_id_mp:
            try:
                payment_info = mp_sdk.payment().get(payment_id_mp)
                status = payment_info["response"]["status"]
                external_reference = payment_info["response"]["external_reference"]

                if external_reference and external_reference.isdigit():
                    our_payment_id = int(external_reference)
                    our_payment = db.query(Payment).filter(Payment.id == our_payment_id).first()

                    if our_payment:
                        if status == "approved":
                            our_payment.status = PaymentStatus.APPROVED
                            # Update booking status
                            booking = db.query(Booking).filter(Booking.id == our_payment.booking_id).first()
                            if booking:
                                booking.status = BookingStatus.CONFIRMED
                                db.add(booking)
                        elif status == "rejected":
                            our_payment.status = PaymentStatus.REJECTED
                            booking = db.query(Booking).filter(Booking.id == our_payment.booking_id).first()
                            if booking:
                                booking.status = BookingStatus.CANCELLED
                                db.add(booking)
                        elif status == "pending":
                            our_payment.status = PaymentStatus.PENDING
                        db.commit()
                        db.refresh(our_payment)
                        print(f"Payment {our_payment_id} updated to {our_payment.status}")

            except Exception as e:
                print(f"Error processing Mercado Pago payment {payment_id_mp}: {e}")
                raise HTTPException(status_code=500, detail=f"Error processing payment: {e}")

    return {"status": "webhook processed"}
