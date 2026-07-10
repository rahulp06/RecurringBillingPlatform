from datetime import datetime

VALID_TRANSITIONS = {
    "trial": ["active", "cancelled"],
    "active": ["paused","past_due", "cancelled"],
    "paused": ["active", "cancelled"],
    "past_due": ["active", "cancelled"],
    "cancelled": []
}


def change_subscription_status(subscription, new_status):

    current_status = subscription.status

    if current_status == new_status:
        return subscription  

    if new_status not in VALID_TRANSITIONS[current_status]:
        raise ValueError(
            f"Invalid transition: "
            f"{current_status} -> {new_status}"
        )

    subscription.status = new_status
    subscription.status_changed_at = datetime.utcnow()

    return subscription