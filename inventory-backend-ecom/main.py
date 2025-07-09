import os
from fastapi import FastAPI
import requests
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",   # 👈 makes app accessible externally
        port=8001,        # 👈 change to your desired port
        reload=True       # 👈 optional: for dev hot-reload
    )

payment_service_url = os.getenv("payment-service-url")

DATABASE_URL = "mysql+pymysql://himal:himal-pwd@35.184.157.35:3306/orders"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    quantity = Column(Integer)

Base.metadata.create_all(bind=engine)

class InventoryCreate(BaseModel):
    name: str
    quantity: int

@app.get("/inventory/status")
def inventory_status():
    return {"status": "Inventory service is running"}

@app.get("/check")
def check_inventory():
    return {"inventory": "available"}

@app.get("/test-flow")
def test_flow():
    # Call payment service
    try:
        resp = requests.get(f"{payment_service_url}/pay")
        payment = resp.json()
    except Exception as e:
        payment = {"error": str(e)}
    return {"inventory": "available", "payment_service_response": payment} 


@app.post("/inventory/add")
def add_inventory(item: InventoryCreate):
    db = SessionLocal()
    db_item = InventoryItem(name=item.name, quantity=item.quantity)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    db.close()
    return {"message": "Item added", "item": {"id": db_item.id, "name": db_item.name, "quantity": db_item.quantity}}

@app.get("/inventory/all")
def get_inventory():
    db = SessionLocal()
    items = db.query(InventoryItem).all()
    db.close()
    return items