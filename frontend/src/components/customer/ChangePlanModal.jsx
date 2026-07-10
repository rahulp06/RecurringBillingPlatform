import "./../../styles/customer/customer-modal.css";

function ChangePlanModal({
    open,
    plan,
    currentPlan,
    onClose,
    onConfirm,
    loading,
}) {

    if (!open || !plan) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-card">

                <h2>Change Subscription</h2>

                <p className="modal-subtitle">
                    Confirm your subscription change.
                </p>

                <div className="plan-summary">

                    <div>

                        <span>Current Plan</span>

                        <h3>{currentPlan?.name || "None"}</h3>

                    </div>

                    <div>

                        <span>New Plan</span>

                        <h3>{plan.name}</h3>

                    </div>

                </div>

                <div className="plan-details">

                    <div>

                        <span>Price</span>

                        <strong>
                            ₹{plan.price} / {plan.billing_interval}
                        </strong>

                    </div>

                    <div>

                        <span>Free Trial</span>

                        <strong>
                            {plan.trial_days} Days
                        </strong>

                    </div>

                </div>

                <div className="modal-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Confirm Upgrade"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ChangePlanModal;