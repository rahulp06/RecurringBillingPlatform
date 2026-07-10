class SubscriptionStatus:

    TRIAL = "trial"

    ACTIVE = "active"

    PAUSED = "paused"

    PAST_DUE = "past_due"

    CANCELLED = "cancelled"


class InvoiceStatus:

    PENDING = "pending"

    PAID = "paid"

    OVERDUE = "overdue"

    CANCELLED = "cancelled"


class PaymentStatus:

    PAID = "paid"

    PENDING = "pending"

    FAILED = "failed"

    REFUNDED = "refunded"