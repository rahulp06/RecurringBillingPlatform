from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import Base, engine, get_db
from backend.models import (
    Plan,
    Customer,
    Subscription,
    BillingCycle,
    Invoice,
    Payment,
    AuditLog,
)
from backend.schemas import PlanCreate, CustomerSignup, CustomerLogin, Token
from backend.crud import create_plan, get_plans, get_customer_by_email, create_customer, authenticate_customer
from backend.security import create_access_token

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

@app.post("/signup")
def signup(
    customer: CustomerSignup,
    db: Session = Depends(get_db)
):

    existing = get_customer_by_email(
        db,
        customer.email
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    create_customer(db, customer)

    return {
        "message": "Customer registered successfully"
    }

@app.post("/login", response_model=Token)
def login(
    customer: CustomerLogin,
    db: Session = Depends(get_db)
):

    db_customer = authenticate_customer(
        db,
        customer.email,
        customer.password
    )

    if not db_customer:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": db_customer.email,
            "role": db_customer.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }