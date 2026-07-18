from sqlalchemy.orm import Session
from .models import Plan
from .schemas import PlanCreate,SubscriptionCreate,BillingCycleCreate,InvoiceCreate,PaymentCreate,AuditLogCreate, CustomerSignup, ProcessPaymentRequest, WebhookPayload
from .models import Customer, Subscription, BillingCycle,Invoice,Payment,AuditLog
from .security import hash_password,verify_password
from datetime import date, timedelta, datetime
import random

def create_plan(db: Session, plan: PlanCreate):
    db_plan = Plan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    log_audit(
        db,
        "plan",
        db_plan.id,
        "Plan Created"
    )
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
    log_audit(
        db,
        "customer",
        db_customer.id,
        "Customer Created"
    )

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
    log_audit(
        db,
        "plan",
        plan.id,
        "Plan Updated"
    )

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

def log_audit(
    db: Session,
    entity_type: str,
    entity_id: int,
    action: str,
    old_value: str = "",
    new_value: str = "",
    performed_by: str = "System"
):

    audit = AuditLog(

        entity_type=entity_type,

        entity_id=entity_id,

        action=action,

        old_value=old_value,

        new_value=new_value,

        performed_by=performed_by,

        created_at=datetime.utcnow()

    )

    db.add(audit)

    return audit

def create_subscription(db: Session, subscription: SubscriptionCreate):

    try:

        # -----------------------------
        # Validate Customer
        # -----------------------------
        customer = (
            db.query(Customer)
            .filter(Customer.id == subscription.customer_id)
            .first()
        )

        if customer is None:
            raise ValueError("Customer not found")

        # -----------------------------
        # Validate Plan
        # -----------------------------
        plan = (
            db.query(Plan)
            .filter(Plan.id == subscription.plan_id)
            .first()
        )

        if plan is None:
            raise ValueError("Plan not found")

        # -----------------------------
        # Calculate Dates
        # -----------------------------
        today = date.today()

        if plan.trial_days > 0:

            status = "trial"
            end_date = today + timedelta(days=plan.trial_days)

        else:

            status = "active"

            if plan.billing_interval.lower() == "monthly":

                end_date = today + timedelta(days=30)

            elif plan.billing_interval.lower() == "annual":

                end_date = today + timedelta(days=365)

            else:

                raise ValueError("Invalid billing interval")

        # -----------------------------
        # Create Subscription
        # -----------------------------
        db_subscription = Subscription(

            customer_id=subscription.customer_id,
            plan_id=subscription.plan_id,
            status=status,
            start_date=today,
            end_date=end_date

        )

        db.add(db_subscription)

        # Get generated ID without committing
        db.flush()

        # -----------------------------
        # Create Billing Cycle
        # -----------------------------
        billing_cycle = BillingCycle(

            subscription_id=db_subscription.id,
            cycle_start_date=today,
            cycle_end_date=end_date,
            renewal_date=end_date,
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()

        )

        db.add(billing_cycle)

        # -----------------------------
        # Create Invoice
        # -----------------------------
        invoice = Invoice(

            invoice_number=f"INV-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",

            subscription_id=db_subscription.id,

            customer_id=db_subscription.customer_id,

            invoice_date=today,

            due_date=end_date,

            subtotal=plan.price,

            tax_amount=0,

            total_amount=plan.price,

            status="paid"

        )

        db.add(invoice)

        # Get invoice ID without committing
        db.flush()

        # -----------------------------
        # Create Payment
        # -----------------------------
        payment = Payment(

            invoice_id=invoice.id,

            payment_reference=f"PAY-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",

            amount=invoice.total_amount,

            payment_method="UPI",

            status="paid",

            payment_date=datetime.utcnow(),

            created_at=datetime.utcnow(),

            updated_at=datetime.utcnow()

        )

        db.add(payment)

        # Transition billing cycle to completed only if payment is confirmed successful
        if payment.status == "paid":
            billing_cycle.status = "completed"

        # -----------------------------
        # Stage Audit Logs
        # -----------------------------
        log_audit(
            db,
            "subscription",
            db_subscription.id,
            "Subscription Created"
        )

        log_audit(
            db,
            "invoice",
            invoice.id,
            "Invoice Generated"
        )

        log_audit(
            db,
            "payment",
            payment.id,
            "Payment Successful"
        )

        # -----------------------------
        # ONE SINGLE COMMIT
        # -----------------------------
        db.commit()

        # Refresh objects after commit
        db.refresh(db_subscription)
        db.refresh(billing_cycle)
        db.refresh(invoice)
        db.refresh(payment)

        return db_subscription

    except Exception:

        db.rollback()

        raise

def pause_subscription(db: Session, subscription_id: int):

    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id
    ).first()

    if subscription is None:
        raise ValueError("Subscription not found")

    from .services import change_subscription_status

    change_subscription_status(subscription, "paused")

    db.commit()
    db.refresh(subscription)

    return subscription


def resume_subscription(db: Session, subscription_id: int):

    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id
    ).first()

    if subscription is None:
        raise ValueError("Subscription not found")

    from .services import change_subscription_status

    change_subscription_status(subscription, "active")

    db.commit()
    db.refresh(subscription)

    return subscription


def cancel_subscription(db: Session, subscription_id: int):

    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id
    ).first()

    if subscription is None:
        raise ValueError("Subscription not found")

    from .services import change_subscription_status

    change_subscription_status(subscription, "cancelled")

    db.commit()
    db.refresh(subscription)
    log_audit(
        db,
        "subscription",
        subscription.id,
        "Subscription Cancelled"
    )

    return subscription

def calculate_proration(
    subscription,
    current_plan,
    new_plan
):
    """
    Returns a dict with all proration figures without writing anything to DB.
    Handles same-plan, zero-remaining-days, trial, monthly, and annual cycles.
    """
    today = date.today()

    cycle_start = subscription.start_date
    cycle_end   = subscription.end_date

    # Total days in the current billing cycle (guard against 0)
    total_days = (cycle_end - cycle_start).days
    if total_days <= 0:
        total_days = 30  # safe default for edge cases

    # Days already consumed; clamp between 0 and total_days
    days_used = max(0, min((today - cycle_start).days, total_days))
    remaining_days = total_days - days_used

    # Proration amounts (rounded to 2 decimal places)
    credit_amount = round(current_plan.price * (remaining_days / total_days), 2)
    charge_amount = round(new_plan.price     * (remaining_days / total_days), 2)
    amount_due    = round(charge_amount - credit_amount, 2)

    return {
        "subscription_id":    subscription.id,
        "current_plan_id":    current_plan.id,
        "current_plan_name":  current_plan.name,
        "new_plan_id":        new_plan.id,
        "new_plan_name":      new_plan.name,
        "billing_interval":   current_plan.billing_interval,
        "total_days":         total_days,
        "days_used":          days_used,
        "remaining_days":     remaining_days,
        "current_plan_price": current_plan.price,
        "new_plan_price":     new_plan.price,
        "credit_amount":      credit_amount,
        "charge_amount":      charge_amount,
        "amount_due":         amount_due,
    }


def change_plan(
    db: Session,
    subscription_id: int,
    new_plan_id: int
):
    """
    Changes the subscription plan with proration:
    1. Validates subscription and new plan exist
    2. Guards against same-plan change
    3. Calculates proration credit/charge
    4. Creates a proration invoice adjustment (skipped if 0 remaining days)
    5. Updates subscription.plan_id
    6. Stores audit log with old/new plan names
    """

    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )

    if subscription is None:
        raise ValueError("Subscription not found")

    current_plan = (
        db.query(Plan)
        .filter(Plan.id == subscription.plan_id)
        .first()
    )

    new_plan = (
        db.query(Plan)
        .filter(Plan.id == new_plan_id)
        .first()
    )

    if new_plan is None:
        raise ValueError("Plan not found")

    # Guard: same plan
    if subscription.plan_id == new_plan_id:
        raise ValueError("Subscription is already on this plan")

    # --- Proration calculation ---
    proration = calculate_proration(subscription, current_plan, new_plan)

    # --- Create proration invoice (only if there are remaining days in the cycle) ---
    if proration["remaining_days"] > 0:
        today = date.today()
        timestamp_str = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
        inv_num = f"PRORTN-{timestamp_str}-{subscription.id}"

        proration_invoice = Invoice(
            invoice_number=inv_num,
            subscription_id=subscription.id,
            customer_id=subscription.customer_id,
            invoice_date=today,
            due_date=subscription.end_date,
            subtotal=proration["charge_amount"],
            tax_amount=0.0,
            total_amount=proration["amount_due"],
            status="unpaid"
        )

        db.add(proration_invoice)
        db.flush()   # get proration_invoice.id before commit

        # Ensure correct plan displays in audit log for proration modal details
        current_plan_display = current_plan.name if current_plan.name.lower().endswith("plan") else f"{current_plan.name} Plan"
        new_plan_display = new_plan.name if new_plan.name.lower().endswith("plan") else f"{new_plan.name} Plan"

        log_audit(
            db,
            "invoice",
            proration_invoice.id,
            "Proration Invoice Generated",
            old_value=f"Unused {current_plan_display} Credit|{proration['credit_amount']}",
            new_value=f"{new_plan_display} Charge|{proration['charge_amount']}"
        )

    # --- Update subscription ---
    old_plan_name = current_plan.name if current_plan else str(subscription.plan_id)
    subscription.plan_id = new_plan_id
    subscription.status_changed_at = datetime.utcnow()

    # --- Audit log for plan change ---
    log_audit(
        db,
        "subscription",
        subscription.id,
        "Plan Changed",
        old_value=old_plan_name,
        new_value=new_plan.name,
        performed_by="Customer"
    )

    db.commit()
    db.refresh(subscription)

    return subscription


def get_subscriptions(db: Session, current_user: Customer):

    if current_user.role == "admin":
        return db.query(Subscription).all()

    return (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == current_user.id
        )
        .all()
    )

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

def change_my_plan(db, current_user, new_plan_id):

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == current_user.id
        )
        .first()
    )

    if not subscription:
        raise ValueError("No active subscription found.")

    return change_plan(
        db,
        subscription.id,
        new_plan_id
    )


def get_proration_preview_for_customer(db, current_user, new_plan_id):
    """Returns a proration preview dict for the customer's active subscription."""
    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == current_user.id
        )
        .first()
    )

    if not subscription:
        raise ValueError("No active subscription found.")

    return get_proration_preview(db, subscription.id, new_plan_id)


def get_proration_preview(db, subscription_id, new_plan_id):
    """Returns a proration preview dict without writing to DB."""
    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )

    if subscription is None:
        raise ValueError("Subscription not found")

    current_plan = (
        db.query(Plan)
        .filter(Plan.id == subscription.plan_id)
        .first()
    )

    new_plan = (
        db.query(Plan)
        .filter(Plan.id == new_plan_id)
        .first()
    )

    if new_plan is None:
        raise ValueError("Plan not found")

    if subscription.plan_id == new_plan_id:
        raise ValueError("Subscription is already on this plan")

    return calculate_proration(subscription, current_plan, new_plan)


def pause_my_subscription(db, current_user):

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == current_user.id
        )
        .first()
    )

    if not subscription:
        raise ValueError("No active subscription found.")

    return pause_subscription(
        db,
        subscription.id
    )

def resume_my_subscription(db, current_user):

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == current_user.id
        )
        .first()
    )

    if not subscription:
        raise ValueError("No active subscription found.")

    return resume_subscription(
        db,
        subscription.id
    )

def cancel_my_subscription(db, current_user):

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == current_user.id
        )
        .first()
    )

    if not subscription:
        raise ValueError("No active subscription found.")

    return cancel_subscription(
        db,
        subscription.id
    )
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


def get_billing_cycles(db: Session, current_user: Customer):

    if current_user.role == "admin":
        return db.query(BillingCycle).all()

    return (
        db.query(BillingCycle)
        .join(
            Subscription,
            BillingCycle.subscription_id == Subscription.id
        )
        .filter(
            Subscription.customer_id == current_user.id
        )
        .all()
    )


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

def generate_billing_cycle(
    db: Session,
    subscription_id: int
):

    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id)
        .first()
    )

    if subscription is None:
        raise ValueError("Subscription not found")

    plan = (
        db.query(Plan)
        .filter(Plan.id == subscription.plan_id)
        .first()
    )

    today = date.today()

    if plan.billing_interval.lower() == "monthly":
        renewal_date = today + timedelta(days=30)

    elif plan.billing_interval.lower() == "annual":
        renewal_date = today + timedelta(days=365)

    else:
        raise ValueError("Invalid billing interval")

    billing_cycle = BillingCycle(
        subscription_id=subscription.id,
        cycle_start_date=today,
        cycle_end_date=renewal_date,
        renewal_date=renewal_date,
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(billing_cycle)
    db.commit()
    db.refresh(billing_cycle)

    return billing_cycle

# ==========================
# INVOICE CRUD
# ==========================

def generate_bulk_invoices(db: Session, tax_rate: float = 0.0):
    import random
    subscriptions = (
        db.query(Subscription)
        .filter(Subscription.status.in_(["active", "trial"]))
        .all()
    )

    generated_invoices = []
    today = date.today()
    today_str = today.strftime('%Y%m%d')

    for sub in subscriptions:
        plan = db.query(Plan).filter(Plan.id == sub.plan_id).first()
        if not plan:
            continue

        cycles = db.query(BillingCycle).filter(BillingCycle.subscription_id == sub.id).all()

        for cycle in cycles:
            existing_invoice = (
                db.query(Invoice)
                .filter(
                    Invoice.subscription_id == sub.id,
                    Invoice.customer_id == sub.customer_id,
                    Invoice.invoice_date == cycle.cycle_start_date,
                    Invoice.due_date == cycle.cycle_end_date
                )
                .first()
            )

            if not existing_invoice:
                suffix = f"{cycle.id:04d}" if cycle.id else f"{random.randint(1000, 9999)}"
                inv_num = f"INV-{today_str}-{suffix}"

                subtotal = plan.price
                tax_amount = round(subtotal * tax_rate, 2)
                total_amount = round(subtotal + tax_amount, 2)

                invoice = Invoice(
                    invoice_number=inv_num,
                    subscription_id=sub.id,
                    customer_id=sub.customer_id,
                    invoice_date=cycle.cycle_start_date,
                    due_date=cycle.cycle_end_date,
                    subtotal=subtotal,
                    tax_amount=tax_amount,
                    total_amount=total_amount,
                    status="unpaid"
                )

                db.add(invoice)
                db.flush()

                log_audit(
                    db,
                    "invoice",
                    invoice.id,
                    "Invoice Generated"
                )

                generated_invoices.append(invoice)

    if generated_invoices:
        db.commit()
        for inv in generated_invoices:
            db.refresh(inv)

    return generated_invoices

def create_invoice(
    db: Session,
    invoice: InvoiceCreate
):

    db_invoice = Invoice(

        invoice_number=invoice.invoice_number,

        subscription_id=invoice.subscription_id,

        customer_id=invoice.customer_id,

        invoice_date=invoice.invoice_date,

        due_date=invoice.due_date,

        subtotal=invoice.subtotal,

        tax_amount=invoice.tax_amount,

        total_amount=invoice.total_amount,

        status="pending"

    )

    db.add(db_invoice)

    db.commit()

    db.refresh(db_invoice)

    log_audit(
        db,
        "invoice",
        db_invoice.id,
        "Invoice Created"
    )

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

def get_my_invoices(db, current_user):

    return (
        db.query(Invoice)
        .filter(
            Invoice.customer_id == current_user.id
        )
        .order_by(
            Invoice.invoice_date.desc()
        )
        .all()
    )

# ==========================
# PAYMENT CRUD
# ==========================

def create_payment(
    db: Session,
    payment: PaymentCreate
):

    invoice = (
        db.query(Invoice)
        .filter(
            Invoice.id == payment.invoice_id
        )
        .first()
    )

    if invoice is None:
        raise ValueError("Invoice not found")

    db_payment = Payment(

        invoice_id=payment.invoice_id,

        payment_reference=payment.payment_reference,

        amount=payment.amount,

        payment_method=payment.payment_method,

        payment_date=payment.payment_date,

        created_at=payment.created_at,

        updated_at=payment.updated_at,

        status="paid"

    )

    db.add(db_payment)

    invoice.status = "paid"

    if db_payment.status == "paid":
        billing_cycle = (
            db.query(BillingCycle)
            .filter(
                BillingCycle.subscription_id == invoice.subscription_id,
                BillingCycle.cycle_start_date == invoice.invoice_date,
                BillingCycle.cycle_end_date == invoice.due_date
            )
            .first()
        )
        if billing_cycle:
            billing_cycle.status = "completed"

    db.commit()

    db.refresh(db_payment)

    log_audit(
        db,
        "payment",
        db_payment.id,
        "Payment Successful"
    )

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

def get_my_payments(db, current_user):

    return (
        db.query(Payment)
        .join(
            Invoice,
            Payment.invoice_id == Invoice.id
        )
        .filter(
            Invoice.customer_id == current_user.id
        )
        .order_by(
            Payment.payment_date.desc()
        )
        .all()
    )

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

# ==========================
# MOCK GATEWAY & WEBHOOK
# ==========================

def handle_payment_webhook(db: Session, payload: WebhookPayload):
    invoice = db.query(Invoice).filter(Invoice.id == payload.invoice_id).first()
    if not invoice:
        return False

    payment = (
        db.query(Payment)
        .filter(Payment.invoice_id == payload.invoice_id)
        .order_by(Payment.created_at.desc())
        .first()
    )

    subscription = None
    if invoice.subscription_id:
        subscription = db.query(Subscription).filter(Subscription.id == invoice.subscription_id).first()

    from .services import change_subscription_status

    if payload.event == "payment_success":
        invoice.status = "paid"
        if payment:

            payment.status = "paid"

            payment.retry_count = 0

            payment.failure_reason = None

            payment.next_retry_date = None

        if subscription:
            try:
                change_subscription_status(subscription, "active")
            except ValueError:
                pass

        billing_cycle = (
            db.query(BillingCycle)
            .filter(
                BillingCycle.subscription_id == invoice.subscription_id,
                BillingCycle.cycle_start_date == invoice.invoice_date,
                BillingCycle.cycle_end_date == invoice.due_date
            )
            .first()
        )
        if billing_cycle:
            billing_cycle.status = "completed"

        log_audit(db, "invoice", invoice.id, "Webhook: Payment Success")

    elif payload.event == "payment_failed":

        if payment:

            payment.status = "failed"

            payment.retry_count += 1

            payment.failure_reason = "Mock Gateway Failure"

            retry_seconds = {
                1: 10,
                2: 20,
                3: 30
            }

            if payment.retry_count <= 3:
                payment.next_retry_date = (
                    datetime.utcnow()
                    + timedelta(seconds=retry_seconds[payment.retry_count])
                )
            else:
                payment.next_retry_date = None

        if subscription:
            try:
                change_subscription_status(subscription, "past_due")
            except ValueError:
                pass

        log_audit(db, "invoice", invoice.id, "Webhook: Payment Failed")

    elif payload.event == "payment_refunded":
        # Invoice status is NOT modified here
        
        if payment:

            payment.status = "refunded"

            payment.refund_status = "completed"

            payment.refunded_amount = payment.amount
            
        log_audit(db, "invoice", invoice.id, "Webhook: Payment Refunded")

    db.commit()
    return True


def process_payment_mock(db: Session, request: ProcessPaymentRequest):
    invoice = db.query(Invoice).filter(Invoice.id == request.invoice_id).first()
    if not invoice:
        raise ValueError("Invoice not found")

    if invoice.status == "paid":
        raise ValueError("Invoice is already paid")

    # Simulate success/fail
    is_success = False
    event = "payment_success" if is_success else "payment_failed"

        # -------------------------------------------------
    # Reuse existing payment if available
    # -------------------------------------------------

    payment = (
        db.query(Payment)
        .filter(Payment.invoice_id == invoice.id)
        .order_by(Payment.created_at.desc())
        .first()
    )

    if payment:

        payment.payment_reference = (
            f"TXN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        )

        payment.amount = request.amount

        payment.payment_method = "Mock Gateway"

        payment.status = "pending"

        payment.payment_date = datetime.utcnow()

        payment.updated_at = datetime.utcnow()

    else:

        payment = Payment(

            invoice_id=invoice.id,

            payment_reference=f"TXN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",

            amount=request.amount,

            payment_method="Mock Gateway",

            status="pending",

            payment_date=datetime.utcnow(),

            created_at=datetime.utcnow(),

            updated_at=datetime.utcnow(),

            retry_count=0,

            next_retry_date=None,

            failure_reason=None,

            refunded_amount=0,

            refund_status="none"
        )

        db.add(payment)

    db.commit()

    db.refresh(payment)

    # Trigger webhook internally
    payload = WebhookPayload(
        event=event,
        invoice_id=invoice.id
    )
    handle_payment_webhook(db, payload)

    # Refresh entities to get their final states post-webhook
    db.refresh(payment)
    db.refresh(invoice)
    
    sub_status = None
    if invoice.subscription_id:
        sub = db.query(Subscription).filter(Subscription.id == invoice.subscription_id).first()
        if sub:
            sub_status = sub.status

    return {
        "payment_reference": payment.payment_reference,
        "payment_status": payment.status,
        "invoice_status": invoice.status,
        "subscription_status": sub_status,
        "message": "Payment processed successfully" if is_success else "Payment processing failed"
    }

# ==========================
# TASK 4 - RETRY FAILED PAYMENT
# ==========================

def retry_failed_payment(db: Session, payment_id: int):

    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        raise ValueError("Payment not found")

    if payment.status != "failed":
        raise ValueError("Only failed payments can be retried")

    if payment.retry_count >= 3:
        raise ValueError("Maximum retry attempts reached")

    if (
        payment.next_retry_date
        and payment.next_retry_date > datetime.utcnow()
    ):
        raise ValueError(
            f"Next retry available after {payment.next_retry_date}"
        )

    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == payment.invoice_id)
        .first()
    )

    if invoice is None:
        raise ValueError("Invoice not found")

    result = process_payment_mock(
        db,
        ProcessPaymentRequest(
            invoice_id=invoice.id,
            amount=payment.amount
        )
    )

    db.refresh(payment)

    log_audit(
        db,
        "payment",
        payment.id,
        f"Retry Attempt #{payment.retry_count}"
    )

    return result

def get_failed_payments(db: Session):
    return (
        db.query(Payment)
        .filter(Payment.status == "failed")
        .order_by(Payment.updated_at.desc())
        .all()
    )

# ==========================
# TASK 5 - REFUND MANAGEMENT
# ==========================

def process_refund(
    db: Session,
    payment_id: int,
    refund_amount: float
):
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        raise ValueError("Payment not found")

    if payment.status not in ["paid", "partially_refunded"]:
        raise ValueError("Only paid payments can be refunded")

    if refund_amount <= 0:
        raise ValueError("Refund amount must be greater than zero")

    refundable = payment.amount - payment.refunded_amount

    if refund_amount > refundable:
        raise ValueError(
            f"Maximum refundable amount is ₹{refundable:.2f}"
        )

    payment.refunded_amount += refund_amount

    if payment.refunded_amount == payment.amount:

        payment.refund_status = "completed"
        payment.status = "refunded"

    else:

        payment.refund_status = "partial"
        payment.status = "partially_refunded"

    payment.updated_at = datetime.utcnow()

    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == payment.invoice_id)
        .first()
    )

    if invoice:
        invoice.status = "paid"

    log_audit(
        db,
        "payment",
        payment.id,
        "Refund Issued",
        old_value=f"Refunded ₹{payment.refunded_amount-refund_amount:.2f}",
        new_value=f"Refunded ₹{payment.refunded_amount:.2f}"
    )

    db.commit()
    db.refresh(payment)

    return {
        "payment_id": payment.id,
        "payment_reference": payment.payment_reference,
        "paid_amount": payment.amount,
        "refunded_amount": payment.refunded_amount,
        "remaining_amount": payment.amount - payment.refunded_amount,
        "refund_status": payment.refund_status,
        "payment_status": payment.status,
        "message": "Refund processed successfully"
    }