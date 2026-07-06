from sqlalchemy.orm import Session
from .models import Plan
from .schemas import PlanCreate,SubscriptionCreate,BillingCycleCreate,InvoiceCreate,PaymentCreate,AuditLogCreate
from .models import Customer, Subscription, BillingCycle,Invoice,Payment,AuditLog
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

# ==========================
# BILLING CYCLE CRUD
# ==========================

from .models import BillingCycle
from .schemas import BillingCycleCreate


def create_billing_cycle(
    db: Session,
    billing_cycle: BillingCycleCreate
):

    db_billing_cycle = BillingCycle(
        **billing_cycle.model_dump()
    )

    db.add(db_billing_cycle)
    db.commit()
    db.refresh(db_billing_cycle)

    return db_billing_cycle


def get_billing_cycles(db: Session):

    return db.query(BillingCycle).all()


def get_billing_cycle(
    db: Session,
    billing_cycle_id: int
):

    return (
        db.query(BillingCycle)
        .filter(BillingCycle.id == billing_cycle_id)
        .first()
    )


def update_billing_cycle(
    db: Session,
    billing_cycle_id: int,
    updated_billing_cycle
):

    billing_cycle = (
        db.query(BillingCycle)
        .filter(BillingCycle.id == billing_cycle_id)
        .first()
    )

    if billing_cycle is None:
        return None

    billing_cycle.subscription_id = updated_billing_cycle.subscription_id
    billing_cycle.cycle_start_date = updated_billing_cycle.cycle_start_date
    billing_cycle.cycle_end_date = updated_billing_cycle.cycle_end_date
    billing_cycle.renewal_date = updated_billing_cycle.renewal_date
    billing_cycle.status = updated_billing_cycle.status
    billing_cycle.created_at = updated_billing_cycle.created_at
    billing_cycle.updated_at = updated_billing_cycle.updated_at

    db.commit()
    db.refresh(billing_cycle)

    return billing_cycle


def delete_billing_cycle(
    db: Session,
    billing_cycle_id: int
):

    billing_cycle = (
        db.query(BillingCycle)
        .filter(BillingCycle.id == billing_cycle_id)
        .first()
    )

    if billing_cycle is None:
        return None

    db.delete(billing_cycle)
    db.commit()

    return {
        "message": "Billing Cycle deleted successfully"
    }

# ==========================
# INVOICE CRUD
# ==========================

def create_invoice(db: Session, invoice: InvoiceCreate):

    db_invoice = Invoice(
        **invoice.model_dump()
    )

    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)

    return db_invoice


def get_invoices(db: Session):

    return db.query(Invoice).all()


def get_invoice(
    db: Session,
    invoice_id: int
):

    return (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )


def update_invoice(
    db: Session,
    invoice_id: int,
    updated_invoice
):

    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if invoice is None:
        return None

    invoice.invoice_number = updated_invoice.invoice_number
    invoice.subscription_id = updated_invoice.subscription_id
    invoice.customer_id = updated_invoice.customer_id
    invoice.invoice_date = updated_invoice.invoice_date
    invoice.due_date = updated_invoice.due_date
    invoice.subtotal = updated_invoice.subtotal
    invoice.tax_amount = updated_invoice.tax_amount
    invoice.total_amount = updated_invoice.total_amount
    invoice.status = updated_invoice.status

    db.commit()
    db.refresh(invoice)

    return invoice


def delete_invoice(
    db: Session,
    invoice_id: int
):

    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if invoice is None:
        return None

    db.delete(invoice)
    db.commit()

    return {
        "message": "Invoice deleted successfully"
    }

# ==========================
# PAYMENT CRUD
# ==========================

def create_payment(
    db: Session,
    payment: PaymentCreate
):

    db_payment = Payment(
        **payment.model_dump()
    )

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return db_payment


def get_payments(db: Session):

    return db.query(Payment).all()


def get_payment(
    db: Session,
    payment_id: int
):

    return (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )


def update_payment(
    db: Session,
    payment_id: int,
    updated_payment
):

    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        return None

    payment.invoice_id = updated_payment.invoice_id
    payment.payment_reference = updated_payment.payment_reference
    payment.amount = updated_payment.amount
    payment.payment_method = updated_payment.payment_method
    payment.status = updated_payment.status
    payment.payment_date = updated_payment.payment_date
    payment.created_at = updated_payment.created_at
    payment.updated_at = updated_payment.updated_at

    db.commit()
    db.refresh(payment)

    return payment


def delete_payment(
    db: Session,
    payment_id: int
):

    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        return None

    db.delete(payment)
    db.commit()

    return {
        "message": "Payment deleted successfully"
    }

# ==========================
# AUDIT LOG CRUD
# ==========================

def create_audit_log(
    db: Session,
    audit_log: AuditLogCreate
):

    db_audit_log = AuditLog(
        **audit_log.model_dump()
    )

    db.add(db_audit_log)
    db.commit()
    db.refresh(db_audit_log)

    return db_audit_log


def get_audit_logs(db: Session):

    return db.query(AuditLog).all()


def get_audit_log(
    db: Session,
    audit_log_id: int
):

    return (
        db.query(AuditLog)
        .filter(AuditLog.id == audit_log_id)
        .first()
    )


def update_audit_log(
    db: Session,
    audit_log_id: int,
    updated_audit_log
):

    audit_log = (
        db.query(AuditLog)
        .filter(AuditLog.id == audit_log_id)
        .first()
    )

    if audit_log is None:
        return None

    audit_log.entity_type = updated_audit_log.entity_type
    audit_log.entity_id = updated_audit_log.entity_id
    audit_log.action = updated_audit_log.action
    audit_log.old_value = updated_audit_log.old_value
    audit_log.new_value = updated_audit_log.new_value
    audit_log.performed_by = updated_audit_log.performed_by
    audit_log.created_at = updated_audit_log.created_at

    db.commit()
    db.refresh(audit_log)

    return audit_log


def delete_audit_log(
    db: Session,
    audit_log_id: int
):

    audit_log = (
        db.query(AuditLog)
        .filter(AuditLog.id == audit_log_id)
        .first()
    )

    if audit_log is None:
        return None

    db.delete(audit_log)
    db.commit()

    return {
        "message": "Audit Log deleted successfully"
    }