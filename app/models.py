from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
)
from .database import Base


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
    email = Column(String, unique=True, nullable=False)
    company_name = Column(String)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    plan_id = Column(Integer)
    status = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)


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