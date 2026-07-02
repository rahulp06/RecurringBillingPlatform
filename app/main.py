from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import (
    Plan,
    Customer,
    Subscription,
    BillingCycle,
    Invoice,
    Payment,
    AuditLog,
)
from app.schemas import PlanCreate
from app.crud import create_plan, get_plans

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Recurring Billing Platform API"}


@app.post("/plans")
def add_plan(plan: PlanCreate, db: Session = Depends(get_db)):
    return create_plan(db, plan)


@app.get("/plans")
def read_plans(db: Session = Depends(get_db)):
    return get_plans(db)