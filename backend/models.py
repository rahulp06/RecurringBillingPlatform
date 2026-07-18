from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
)
from .database import Base
from datetime import datetime,date


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    billing_interval = Column(String, nullable=False)
    trial_days = Column(Integer, default=0)
    features = Column(String)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    company_name = Column(String)

    role = Column(
        String,
        default="customer"
    )


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=False)
    plan_id = Column(Integer,nullable=False)

    status = Column(String, default="trial", nullable=False)

    start_date = Column(Date,nullable=False)
    end_date = Column(Date,nullable=False)

    status_changed_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class BillingCycle(Base):
    __tablename__ = "billing_cycles"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer)
    cycle_start_date = Column(Date)
    cycle_end_date = Column(Date)
    renewal_date = Column(Date)
    status = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String)
    subscription_id = Column(Integer)
    customer_id = Column(Integer)
    invoice_date = Column(Date)
    due_date = Column(Date)
    subtotal = Column(Float)
    tax_amount = Column(Float)
    total_amount = Column(Float)
    status = Column(String)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    invoice_id = Column(Integer)

    payment_reference = Column(String)

    amount = Column(Float)

    payment_method = Column(String)

    status = Column(String)

    payment_date = Column(DateTime)

    created_at = Column(DateTime)

    updated_at = Column(DateTime)

    # ==========================
    # Task 4 - Retry & Refund
    # ==========================

    retry_count = Column(Integer, default=0)

    next_retry_date = Column(DateTime, nullable=True)

    failure_reason = Column(String, nullable=True)

    refunded_amount = Column(Float, default=0)

    refund_status = Column(String, default="none")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String)
    entity_id = Column(Integer)
    action = Column(String)
    old_value = Column(String)
    new_value = Column(String)
    performed_by = Column(String)
    created_at = Column(DateTime)