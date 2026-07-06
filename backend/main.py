from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
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
from backend.schemas import (
    PlanCreate, 
    CustomerSignup, 
    CustomerLogin, 
    Token, 
    CustomerUpdate,
    SubscriptionCreate,
    BillingCycleCreate,
    InvoiceCreate,
    PaymentCreate,
    AuditLogCreate
)
from backend.crud import (
    create_plan,
    get_plans, 
    get_customer_by_email, 
    create_customer, 
    authenticate_customer,
    get_plan,
    update_plan,
    delete_plan,
    get_customers,
    get_customer,
    update_customer,
    delete_customer,
    create_subscription,
    get_subscriptions,
    get_subscription,
    update_subscription,
    delete_subscription,
    create_billing_cycle,
    get_billing_cycles,
    get_billing_cycle,
    update_billing_cycle,
    delete_billing_cycle,
    create_invoice,
    get_invoices,
    get_invoice,
    update_invoice,
    delete_invoice,
    create_payment,
    get_payments,
    get_payment,
    update_payment,
    delete_payment,
    create_audit_log,
    get_audit_logs,
    get_audit_log,
    update_audit_log,
    delete_audit_log
)
from backend.security import (
    create_access_token, 
    decode_access_token, 
    hash_password, 
    verify_password
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

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

def require_admin(
    current_user: Customer = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.post("/plans")
def add_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
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

@app.get("/plans/{plan_id}")
def read_plan(
    plan_id: int,
    db: Session = Depends(get_db)
):

    plan = get_plan(db, plan_id)

    if plan is None:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return plan

@app.put("/plans/{plan_id}")
def edit_plan(
    plan_id: int,
    plan: PlanCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_plan(
        db,
        plan_id,
        plan
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return updated

@app.delete("/plans/{plan_id}")
def remove_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_plan(
        db,
        plan_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Plan not found"
        )

    return deleted

@app.get("/customers")
def read_customers(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
    return get_customers(db)

@app.get("/customers/{customer_id}")
def read_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    customer = get_customer(db, customer_id)

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer

@app.put("/customers/{customer_id}")
def edit_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_customer(
        db,
        customer_id,
        customer
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return updated

@app.delete("/customers/{customer_id}")
def remove_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_customer(
        db,
        customer_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return deleted

@app.post("/subscriptions")
def add_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_subscription(
        db,
        subscription
    )

@app.get("/subscriptions")
def read_subscriptions(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_subscriptions(db)

@app.get("/subscriptions/{subscription_id}")
def read_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    subscription = get_subscription(
        db,
        subscription_id
    )

    if subscription is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return subscription

@app.put("/subscriptions/{subscription_id}")
def edit_subscription(
    subscription_id: int,
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_subscription(
        db,
        subscription_id,
        subscription
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return updated

@app.delete("/subscriptions/{subscription_id}")
def remove_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_subscription(
        db,
        subscription_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return deleted

# ==========================================================
# BILLING CYCLE CRUD
# ==========================================================

@app.post("/billing-cycles")
def add_billing_cycle(
    billing_cycle: BillingCycleCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_billing_cycle(
        db,
        billing_cycle
    )


@app.get("/billing-cycles")
def read_billing_cycles(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_billing_cycles(db)


@app.get("/billing-cycles/{billing_cycle_id}")
def read_billing_cycle(
    billing_cycle_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    billing_cycle = get_billing_cycle(
        db,
        billing_cycle_id
    )

    if billing_cycle is None:
        raise HTTPException(
            status_code=404,
            detail="Billing Cycle not found"
        )

    return billing_cycle


@app.put("/billing-cycles/{billing_cycle_id}")
def edit_billing_cycle(
    billing_cycle_id: int,
    billing_cycle: BillingCycleCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_billing_cycle(
        db,
        billing_cycle_id,
        billing_cycle
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Billing Cycle not found"
        )

    return updated


@app.delete("/billing-cycles/{billing_cycle_id}")
def remove_billing_cycle(
    billing_cycle_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_billing_cycle(
        db,
        billing_cycle_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Billing Cycle not found"
        )

    return deleted

# ==========================================================
# INVOICE CRUD
# ==========================================================

@app.post("/invoices")
def add_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_invoice(db, invoice)


@app.get("/invoices")
def read_invoices(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_invoices(db)


@app.get("/invoices/{invoice_id}")
def read_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    invoice = get_invoice(db, invoice_id)

    if invoice is None:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return invoice


@app.put("/invoices/{invoice_id}")
def edit_invoice(
    invoice_id: int,
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_invoice(
        db,
        invoice_id,
        invoice
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return updated


@app.delete("/invoices/{invoice_id}")
def remove_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_invoice(
        db,
        invoice_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    return deleted

# ==========================================================
# PAYMENT CRUD
# ==========================================================

@app.post("/payments")
def add_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_payment(
        db,
        payment
    )


@app.get("/payments")
def read_payments(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_payments(db)


@app.get("/payments/{payment_id}")
def read_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    payment = get_payment(
        db,
        payment_id
    )

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return payment


@app.put("/payments/{payment_id}")
def edit_payment(
    payment_id: int,
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_payment(
        db,
        payment_id,
        payment
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return updated


@app.delete("/payments/{payment_id}")
def remove_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_payment(
        db,
        payment_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return deleted

# ==========================================================
# AUDIT LOG CRUD
# ==========================================================

@app.post("/audit-logs")
def add_audit_log(
    audit_log: AuditLogCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_audit_log(
        db,
        audit_log
    )


@app.get("/audit-logs")
def read_audit_logs(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_audit_logs(db)


@app.get("/audit-logs/{audit_log_id}")
def read_audit_log(
    audit_log_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    audit_log = get_audit_log(
        db,
        audit_log_id
    )

    if audit_log is None:
        raise HTTPException(
            status_code=404,
            detail="Audit Log not found"
        )

    return audit_log


@app.put("/audit-logs/{audit_log_id}")
def edit_audit_log(
    audit_log_id: int,
    audit_log: AuditLogCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    updated = update_audit_log(
        db,
        audit_log_id,
        audit_log
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Audit Log not found"
        )

    return updated


@app.delete("/audit-logs/{audit_log_id}")
def remove_audit_log(
    audit_log_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    deleted = delete_audit_log(
        db,
        audit_log_id
    )

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Audit Log not found"
        )

    return deleted