from pydantic import BaseModel, EmailStr
from datetime import date, datetime

# ==========================
# PLAN
# ==========================

class PlanBase(BaseModel):
    name: str
    price: float
    billing_interval: str
    trial_days: int
    features: str


class PlanCreate(PlanBase):
    pass


class PlanResponse(PlanBase):
    id: int

    class Config:
        from_attributes = True


# ==========================
# CUSTOMER
# ==========================

class CustomerSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    company_name: str


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class CustomerUpdate(BaseModel):
    name: str
    email: EmailStr
    company_name: str


# ==========================
# TOKEN
# ==========================

class Token(BaseModel):
    access_token: str
    token_type: str


# ==========================
# SUBSCRIPTION
# ==========================

# ==========================
# SUBSCRIPTION
# ==========================

class SubscriptionCreate(BaseModel):
    customer_id: int
    plan_id: int


class SubscriptionResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    status: str
    start_date: date
    end_date: date

    class Config:
        from_attributes = True

class ChangePlanRequest(BaseModel):
    new_plan_id: int


class ProrationPreviewResponse(BaseModel):
    subscription_id: int
    current_plan_id: int
    current_plan_name: str
    new_plan_id: int
    new_plan_name: str
    billing_interval: str
    total_days: int
    days_used: int
    remaining_days: int
    current_plan_price: float
    new_plan_price: float
    credit_amount: float
    charge_amount: float
    amount_due: float

# ==========================
# BILLING CYCLE
# ==========================

class BillingCycleBase(BaseModel):
    subscription_id: int
    cycle_start_date: date
    cycle_end_date: date
    renewal_date: date
    status: str
    created_at: datetime
    updated_at: datetime


class BillingCycleCreate(BillingCycleBase):
    pass


class BillingCycleResponse(BillingCycleBase):
    id: int

    class Config:
        from_attributes = True

# ==========================
# INVOICE
# ==========================

class InvoiceBase(BaseModel):
    invoice_number: str
    subscription_id: int
    customer_id: int
    invoice_date: date
    due_date: date
    subtotal: float
    tax_amount: float
    total_amount: float
    status: str


class InvoiceCreate(BaseModel):

    invoice_number: str

    subscription_id: int

    customer_id: int

    invoice_date: date

    due_date: date

    subtotal: float

    tax_amount: float

    total_amount: float

class InvoiceResponse(InvoiceBase):
    id: int

    class Config:
        from_attributes = True

# ==========================
# PAYMENT
# ==========================

from datetime import datetime

class PaymentBase(BaseModel):
    invoice_id: int
    payment_reference: str
    amount: float
    payment_method: str
    status: str
    payment_date: datetime
    created_at: datetime
    updated_at: datetime


class PaymentCreate(BaseModel):

    invoice_id: int

    payment_reference: str

    amount: float

    payment_method: str

    payment_date: datetime

    created_at: datetime

    updated_at: datetime


class PaymentResponse(PaymentBase):
    id: int

    class Config:
        from_attributes = True

# ==========================
# AUDIT LOG
# ==========================

class AuditLogBase(BaseModel):
    entity_type: str
    entity_id: int
    action: str
    old_value: str
    new_value: str
    performed_by: str
    created_at: datetime


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogResponse(AuditLogBase):
    id: int

    class Config:
        from_attributes = True

# ==========================
# MOCK GATEWAY & WEBHOOK
# ==========================

class ProcessPaymentRequest(BaseModel):
    invoice_id: int
    amount: float

class WebhookPayload(BaseModel):
    event: str
    invoice_id: int

class ProcessPaymentResponse(BaseModel):
    payment_reference: str
    payment_status: str
    invoice_status: str
    subscription_status: str | None = None
    message: str

# ==========================
# TASK 4 - FAILED PAYMENT RETRY
# ==========================

class RetryPaymentResponse(BaseModel):
    payment_reference: str
    payment_status: str
    invoice_status: str
    subscription_status: str | None = None
    retry_count: int
    next_retry_date: datetime | None = None
    message: str


class FailedPaymentResponse(BaseModel):
    payment_id: int
    invoice_id: int
    payment_reference: str
    amount: float
    retry_count: int
    next_retry_date: datetime | None = None
    failure_reason: str | None = None


class RetryAllPaymentsResponse(BaseModel):
    total_failed: int
    retried: int
    successful: int
    failed: int
    message: str


# ==========================
# TASK 4 - REFUND MANAGEMENT
# ==========================

class RefundRequest(BaseModel):
    payment_id: int
    amount: float
    reason: str


class RefundResponse(BaseModel):
    payment_id: int
    payment_reference: str
    paid_amount: float
    refunded_amount: float
    remaining_amount: float
    refund_status: str
    payment_status: str
    message: str


class RefundHistoryResponse(BaseModel):
    payment_id: int
    payment_reference: str
    refunded_amount: float
    refund_status: str
    payment_status: str
    refund_date: datetime