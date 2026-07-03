from sqlalchemy.orm import Session
from .models import Plan
from .schemas import PlanCreate
from .models import Customer
from .schemas import CustomerSignup
from .security import hash_password,verify_password

def create_plan(db: Session, plan: PlanCreate):
    db_plan = Plan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_plans(db: Session):
    return db.query(Plan).all()

def get_customer_by_email(db: Session, email: str):
    return (
        db.query(Customer)
        .filter(Customer.email == email)
        .first()
    )


def create_customer(db: Session, customer: CustomerSignup):

    db_customer = Customer(
        name=customer.name,
        email=customer.email,
        password=hash_password(customer.password),
        company_name=customer.company_name,
        role="customer"
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer

def authenticate_customer(db: Session, email: str, password: str):

    customer = get_customer_by_email(db, email)

    print("=" * 50)
    print("Email entered:", email)
    print("Password entered:", password)

    if not customer:
        print("Customer NOT FOUND")
        return None

    print("Stored Hash:", customer.password)

    is_valid = verify_password(password, customer.password)

    print("Password Valid:", is_valid)
    print("=" * 50)

    if not is_valid:
        return None

    return customer