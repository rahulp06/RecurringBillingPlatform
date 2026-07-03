from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
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
from backend.security import create_access_token, decode_access_token

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
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_customer = authenticate_customer(
        db,
        form_data.username,   # username field contains the email
        form_data.password
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

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload.get("sub")

    customer = get_customer_by_email(
        db,
        email
    )

    if customer is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return customer

@app.get("/me")
def get_me(
    current_user: Customer = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }