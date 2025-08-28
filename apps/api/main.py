from fastapi import FastAPI
from routers import auth, leads, bookings, catalog, payments, inventory, karaoke, documents, social, reports, settings

app = FastAPI(
    title="Karina Ocampo Event Management API",
    version="0.1.0",
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(leads.router, prefix="/leads", tags=["Leads"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(catalog.router, prefix="/catalog", tags=["Catalog"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(karaoke.router, prefix="/karaoke", tags=["Karaoke"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(social.router, prefix="/social", tags=["Social"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
