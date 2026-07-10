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
    AuditLogCreate,
    ChangePlanRequest
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
    delete_audit_log,
    pause_subscription,
    resume_subscription,
    cancel_subscription,
    change_plan,
    generate_billing_cycle,
    get_my_invoices,
    get_my_payments,
    change_my_plan,
    pause_my_subscription,
    resume_my_subscription,
    cancel_my_subscription
)
from backend.security import (
    create_access_token, 
    decode_access_token, 
    hash_password, 
    verify_password
)

tags_metadata = [
    {"name": "Authentication"},
    {"name": "Profile"},
    {"name": "Plans"},
    {"name": "Customers"},
    {"name": "Subscriptions"},
    {"name": "Billing Cycles"},
    {"name": "Invoices"},
    {"name": "Payments"},
    {"name": "Audit Logs"},
]

app = FastAPI(
    title="Recurring Billing Platform API",
    description="Backend APIs for the Recurring Billing Platform",
    version="1.0.0",
    openapi_tags=tags_metadata
)

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

    print("TOKEN:", token)

    payload = decode_access_token(token)

    print("PAYLOAD:", payload)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload.get("sub")

    print("EMAIL:", email)

    customer = get_customer_by_email(db, email)

    print("CUSTOMER:", customer)

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


@app.post("/plans", tags=["Plans"])
def add_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
    return create_plan(db, plan)


@app.get("/plans", tags=["Plans"])
def read_plans(db: Session = Depends(get_db)):
    return get_plans(db)

@app.post("/signup", tags=["Authentication"])
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

@app.post("/login", response_model=Token, tags=["Authentication"])
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


@app.get("/me", tags=["Profile"])
def get_me(
    current_user: Customer = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

@app.get("/plans/{plan_id}", tags=["Plans"])
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

@app.put("/plans/{plan_id}", tags=["Plans"])
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

@app.delete("/plans/{plan_id}", tags=["Plans"])
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

@app.get("/customers", tags=["Customers"])
def read_customers(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
    return get_customers(db)

@app.get("/customers/{customer_id}", tags=["Customers"])
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

@app.put("/customers/{customer_id}", tags=["Customers"])
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

@app.delete("/customers/{customer_id}", tags=["Customers"])
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

@app.post("/subscriptions", tags=["Subscriptions"])
def add_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    try:
        return create_subscription(db, subscription)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/subscriptions/{subscription_id}/pause", tags=["Subscriptions"])
def pause_subscription_api(
    subscription_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
    try:
        return pause_subscription(db, subscription_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/subscriptions/{subscription_id}/resume", tags=["Subscriptions"])
def resume_subscription_api(
    subscription_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
    try:
        return resume_subscription(db, subscription_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/subscriptions/{subscription_id}/cancel", tags=["Subscriptions"])
def cancel_subscription_api(
    subscription_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):
    try:
        return cancel_subscription(db, subscription_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/subscriptions/{subscription_id}/change-plan", tags=["Subscriptions"])
def change_plan_api(
    subscription_id: int,
    request: ChangePlanRequest,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    try:
        return change_plan(
            db,
            subscription_id,
            request.plan_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@app.get("/subscriptions", tags=["Subscriptions"])
def read_subscriptions(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    return get_subscriptions(db, current_user)

@app.get("/subscriptions/{subscription_id}", tags=["Subscriptions"])
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

@app.put("/subscriptions/{subscription_id}", tags=["Subscriptions"])
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

@app.delete("/subscriptions/{subscription_id}", tags=["Subscriptions"])
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

@app.post("/my-subscription/change-plan", tags=["Customer"])
def customer_change_plan(
    request: ChangePlanRequest,
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    try:

        return change_my_plan(
            db,
            current_user,
            request.plan_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
@app.post("/my-subscription/pause", tags=["Customer"])
def customer_pause_subscription(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    try:

        return pause_my_subscription(
            db,
            current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
@app.post("/my-subscription/resume", tags=["Customer"])
def customer_resume_subscription(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    try:

        return resume_my_subscription(
            db,
            current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
@app.post("/my-subscription/cancel", tags=["Customer"])
def customer_cancel_subscription(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    try:

        return cancel_my_subscription(
            db,
            current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
# ==========================================================
# BILLING CYCLE CRUD
# ==========================================================

@app.post("/billing-cycles", tags=["Billing Cycles"])
def add_billing_cycle(
    billing_cycle: BillingCycleCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_billing_cycle(
        db,
        billing_cycle
    )


@app.get("/billing-cycles", tags=["Billing Cycles"])
def read_billing_cycles(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    return get_billing_cycles(db,current_user)


@app.get("/billing-cycles/{billing_cycle_id}", tags=["Billing Cycles"])
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


@app.put("/billing-cycles/{billing_cycle_id}", tags=["Billing Cycles"])
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


@app.delete("/billing-cycles/{billing_cycle_id}", tags=["Billing Cycles"])
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

@app.post("/subscriptions/{subscription_id}/generate-billing-cycle", tags=["Billing Cycles"])
def generate_billing_cycle_api(
    subscription_id: int,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    try:
        return generate_billing_cycle(
            db,
            subscription_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

# ==========================================================
# INVOICE CRUD
# ==========================================================

@app.post("/invoices", tags=["Invoices"])
def add_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_invoice(db, invoice)


@app.get("/invoices", tags=["Invoices"])
def read_invoices(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_invoices(db)


@app.get("/invoices/{invoice_id}", tags=["Invoices"])
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


@app.put("/invoices/{invoice_id}", tags=["Invoices"])
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


@app.delete("/invoices/{invoice_id}", tags=["Invoices"])
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

@app.get("/my-invoices", tags=["Profile"])
def read_my_invoices(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    return get_my_invoices(
        db,
        current_user
    )

# ==========================================================
# PAYMENT CRUD
# ==========================================================

@app.post("/payments", tags=["Payments"])
def add_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_payment(
        db,
        payment
    )


@app.get("/payments", tags=["Payments"])
def read_payments(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_payments(db)


@app.get("/payments/{payment_id}", tags=["Payments"])
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


@app.put("/payments/{payment_id}", tags=["Payments"])
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


@app.delete("/payments/{payment_id}", tags=["Payments"])
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

@app.get("/my-payments", tags=["Profile"])
def read_my_payments(
    db: Session = Depends(get_db),
    current_user: Customer = Depends(get_current_user)
):

    return get_my_payments(
        db,
        current_user
    )

# ==========================================================
# AUDIT LOG CRUD
# ==========================================================

@app.post("/audit-logs", tags=["Audit Logs"])
def add_audit_log(
    audit_log: AuditLogCreate,
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return create_audit_log(
        db,
        audit_log
    )


@app.get("/audit-logs", tags=["Audit Logs"])
def read_audit_logs(
    db: Session = Depends(get_db),
    admin: Customer = Depends(require_admin)
):

    return get_audit_logs(db)


@app.get("/audit-logs/{audit_log_id}", tags=["Audit Logs"])
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


@app.put("/audit-logs/{audit_log_id}", tags=["Audit Logs"])
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


@app.delete("/audit-logs/{audit_log_id}", tags=["Audit Logs"])
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