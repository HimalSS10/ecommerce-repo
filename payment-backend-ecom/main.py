import os
from fastapi import FastAPI, Body
import requests
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL, e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_service_url = os.getenv("user-service-url")
invoice_service_url = os.getenv("invoice-service-url")

DATABASE_URL = "mysql+pymysql://himal:himal-pwd@35.184.157.35:3306/orders"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Add this class after Base = declarative_base()
class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer)
    user_id = Column(Integer)
    price = Column(Integer)  # or Float if you want decimals

Base.metadata.create_all(bind=engine)

# Pydantic model for request validation
class PaymentCreate(BaseModel):
    order_id: int
    user_id: int
    price: int
# payments_db = PaymentsDB()

@app.get("/payment/status")
def payment_status():
    return {"status": "Payment service is running"}

@app.get("/payment/get")
def get_payments():
    db = SessionLocal()
    try:
        payments = db.query(Payment).all()
        result = []
        for payment in payments:
            # Fetch user info from users service
            user_name = None
            try:
                user_resp = requests.get(f"{user_service_url}/users/info/{payment.user_id}")
                if user_resp.status_code == 200:
                    user_data = user_resp.json()
                    user_name = user_data.get("name")
            except Exception as e:
                user_name = None  # Could log error if desired

            result.append({
                "id": payment.id,
                "orderId": payment.order_id,
                "userId": payment.user_id,
                "userName": user_name,
                "price": payment.price
            })
        return {"payments": result}
    finally:
        db.close()

@app.get("/test-flow")
def test_flow():
    # Call invoice service
    try:
        resp = requests.get(f"{invoice_service_url}/generate")
        invoice = resp.json()
    except Exception as e:
        invoice = {"error": str(e)}
    return {"payment": "paid", "invoice_service_response": invoice} 

@app.post("/payment/add")
def add_payment(payment: PaymentCreate):
    db = SessionLocal()
    db_payment = Payment(order_id=payment.order_id, user_id=payment.user_id, price=payment.price)
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    db.close()
    return {"message": "Payment recorded", "payment": {
        "id": db_payment.id,
        "order_id": db_payment.order_id,
        "user_id": db_payment.user_id,
        "price": db_payment.price
    }}