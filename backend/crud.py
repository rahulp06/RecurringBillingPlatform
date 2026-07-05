from sqlalchemy.orm import Session
from .models import Plan
from .schemas import PlanCreate,SubscriptionCreate
from .models import Customer, Subscription
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


def get_plan(db: Session, plan_id: int):
    return (
        db.query(Plan)
        .filter(Plan.id == plan_id)
        .first()
    )

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

def update_plan(db: Session, plan_id: int, updated_plan):

    plan = (
        db.query(Plan)
        .filter(Plan.id == plan_id)
        .first()
    )

    if plan is None:
        return None

    plan.name = updated_plan.name
    plan.price = updated_plan.price
    plan.billing_interval = updated_plan.billing_interval
    plan.trial_days = updated_plan.trial_days
    plan.features = updated_plan.features

    db.commit()
    db.refresh(plan)

    return plan

def delete_plan(db: Session, plan_id: int):

    plan = (
        db.query(Plan)
        .filter(Plan.id == plan_id)
        .first()
    )

    if plan is None:
        return None

    db.delete(plan)
    db.commit()

    return {"message": "Plan deleted successfully"}

def get_customers(db: Session):
    return db.query(Customer).all()

def get_customer(db: Session, customer_id: int):
    return (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

def update_customer(
    db: Session,
    customer_id: int,
    updated_customer
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if customer is None:
        return None

    customer.name = updated_customer.name
    customer.email = updated_customer.email
    customer.company_name = updated_customer.company_name

    db.commit()
    db.refresh(customer)

    return customer

def delete_customer(
    db: Session,
    customer_id: int
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if customer is None:
        return None

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }

def create_subscription(db: Session, subscription: SubscriptionCreate):

    db_subscription = Subscription(
        **subscription.model_dump()
    )

    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)

    return db_subscription

def get_subscriptions(db: Session):
    return db.query(Subscription).all()

def get_subscription(db: Session, subscription_id: int):

    return (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )

def update_subscription(
    db: Session,
    subscription_id: int,
    updated_subscription
):

    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )

    if subscription is None:
        return None

    subscription.customer_id = updated_subscription.customer_id
    subscription.plan_id = updated_subscription.plan_id
    subscription.status = updated_subscription.status
    subscription.start_date = updated_subscription.start_date
    subscription.end_date = updated_subscription.end_date

    db.commit()
    db.refresh(subscription)

    return subscription

def delete_subscription(
    db: Session,
    subscription_id: int
):

    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )

    if subscription is None:
        return None

    db.delete(subscription)
    db.commit()

    return {
        "message": "Subscription deleted successfully"
    }