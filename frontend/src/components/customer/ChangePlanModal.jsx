import "./../../styles/customer/customer-modal.css";

function ChangePlanModal({
    open,
    plan,
    currentPlan,
    prorateInfo,
    onClose,
    onConfirm,
    loading,
}) {

    if (!open || !plan) return null;

    const isDowngrade = prorateInfo
        ? prorateInfo.amount_due < 0
        : (plan.price < (currentPlan?.price || 0));

    const formatPlanName = (name) => {
        if (!name) return "";
        return name.toLowerCase().endsWith("plan") ? name : `${name} Plan`;
    };

    return (

        <div className="modal-overlay">

            <div className="modal-card">

                <h2>{isDowngrade ? "Plan Downgrade Summary" : "Plan Upgrade Summary"}</h2>

                <p className="modal-subtitle">
                    Review the proration adjustment before confirming.
                </p>

                {/* Current → New plan */}
                <div className="plan-summary">

                    <div>
                        <span>Current Plan</span>
                        <h3>{currentPlan?.name || "None"}</h3>
                        {currentPlan && (
                            <small>₹{currentPlan.price} / {currentPlan.billing_interval}</small>
                        )}
                    </div>

                    <div className="plan-arrow">→</div>

                    <div>
                        <span>New Plan</span>
                        <h3>{plan.name}</h3>
                        <small>₹{plan.price} / {plan.billing_interval}</small>
                    </div>

                </div>

                {/* Proration breakdown */}
                {prorateInfo ? (
                    <div className="proration-breakdown">

                        <div className="proration-row">
                            <span>Billing Period</span>
                            <span>
                                {prorateInfo.days_used} used / {prorateInfo.total_days} total days
                            </span>
                        </div>

                        <div className="proration-row">
                            <span>Remaining Days</span>
                            <span>{prorateInfo.remaining_days} days</span>
                        </div>

                        <div className="proration-divider" />

                        <div className="proration-row credit">
                            <span>
                                Unused {formatPlanName(prorateInfo.current_plan_name)} Credit
                            </span>
                            <span>−₹{prorateInfo.credit_amount.toFixed(2)}</span>
                        </div>

                        <div className="proration-row charge">
                            <span>
                                {formatPlanName(prorateInfo.new_plan_name)} Charge
                            </span>
                            <span>+₹{prorateInfo.charge_amount.toFixed(2)}</span>
                        </div>

                        <div className="proration-divider" />

                        <div className="proration-row total">
                            <span>
                                {prorateInfo.remaining_days === 0
                                    ? "No charge (cycle ends today)"
                                    : isDowngrade
                                    ? "Credit to your account"
                                    : "Amount Due"}
                            </span>
                            <span
                                className={
                                    isDowngrade
                                        ? "amount-credit"
                                        : "amount-due"
                                }
                            >
                                {isDowngrade
                                    ? `−₹${Math.abs(prorateInfo.amount_due).toFixed(2)}`
                                    : `₹${prorateInfo.amount_due.toFixed(2)}`}
                            </span>
                        </div>

                        {prorateInfo.remaining_days === 0 && (
                            <p className="proration-note">
                                Your billing cycle ends today. The new plan will take
                                effect from the next cycle.
                            </p>
                        )}

                        {isDowngrade && (
                            <p className="proration-note">
                                This is a downgrade. The credit will be applied to
                                your next invoice.
                            </p>
                        )}

                    </div>
                ) : (
                    /* Fallback if proration not loaded */
                    <div className="plan-details">
                        <div>
                            <span>Price</span>
                            <strong>
                                ₹{plan.price} / {plan.billing_interval}
                            </strong>
                        </div>
                        <div>
                            <span>Free Trial</span>
                            <strong>{plan.trial_days} Days</strong>
                        </div>
                    </div>
                )}

                <div className="modal-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : (isDowngrade ? "Confirm Downgrade" : "Confirm Upgrade")}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ChangePlanModal;