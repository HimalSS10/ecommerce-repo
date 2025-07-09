import os
from fastapi import FastAPI, Body, HTTPException
import requests
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",   # 👈 makes app accessible externally
        port=8004,        # 👈 change to your desired port
        reload=True       # 👈 optional: for dev hot-reload
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL, e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_service_url = os.getenv("user-service-url")

DATABASE_URL = "mysql+pymysql://himal:himal-pwd@35.184.157.35:3306/orders"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Ensure the InvoiceDB model is registered with Base
class InvoiceDB(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer)
    user_id = Column(Integer)
    amount = Column(Integer)
    description = Column(String(255))
    status = Column(String(255))
Base.metadata.create_all(bind=engine)

class Invoice(BaseModel):
    payment_id: int
    user_id: int
    amount: int
    description: str
    status: str
    
@app.get("/invoice/status")
def invoice_status():
    return {"status": "Invoice service is running"}

@app.get("/generate")
def generate_invoice():
    return {"invoice": "generated"}

@app.get("/test-flow")
def test_flow():
    # Call users service
    try:
        resp = requests.get(f"{user_service_url}/users/info/1")
        user = resp.json()
    except Exception as e:
        user = {"error": str(e)}
    return {"invoice": "generated", "users_service_response": user}

@app.get("/invoice/get")
def get_invoices():
    db = SessionLocal()
    try:
        invoices = db.query(InvoiceDB).all()
        result = []
        for invoice in invoices:
            user_name = None
            try:
                user_resp = requests.get(f"{user_service_url}/users/info/{invoice.user_id}")
                if user_resp.status_code == 200:
                    user_data = user_resp.json()
                    user_name = user_data.get("name")
            except Exception as e:
                user_name = None  # Optionally log error

            result.append({
                "id": invoice.id,
                "user_id": invoice.user_id,
                "user_name": user_name,
                "payment_id": invoice.payment_id,
                "price": invoice.amount,
                "description": invoice.description,
                "status": "PAID"
            })
        return {"invoices": result}
    finally:
        db.close()

@app.post("/invoice/create")
def create_invoice(invoice: Invoice):
    db = SessionLocal()
    # print(f"db_invoice",db_invoice)
    try:
        db_invoice = InvoiceDB(
            payment_id=invoice.payment_id,
            user_id=invoice.user_id,
            amount=int(invoice.amount),
            description=invoice.description,
            status=invoice.status
        )
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        return {
            "message": "Invoice created",
            "invoice": {
                "id": db_invoice.id,
                "payment_id": db_invoice.payment_id,
                "user_id": db_invoice.user_id,
                "amount": db_invoice.amount,
                "description": db_invoice.description,
                "status": db_invoice.status
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

