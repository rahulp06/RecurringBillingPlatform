import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    FaCalendarAlt,
    FaCreditCard,
    FaBox,
    FaLayerGroup,
    FaExchangeAlt,
} from "react-icons/fa";
import Card from "../../components/common/Card";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import CustomerLayout from "../../layouts/CustomerLayout";
import StatusBadge from "../../components/common/StatusBadge";

import {
    getPlans,
    getSubscriptions,
    pauseMySubscription,
    resumeMySubscription,
    cancelMySubscription,
    getMyPlanHistory,
} from "../../services/api";

import "../../styles/customer/customer-subscription.css";

function MySubscription() {

    const [subscription, setSubscription] = useState(null);
    const [plans, setPlans] = useState([]);
    const [planChanges, setPlanChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const loadData = async () => {

        try {

            const [subscriptions, plansData, historyData] = await Promise.all([
                getSubscriptions(),
                getPlans(),
                getMyPlanHistory().catch(() => []),
            ]);

            setPlans(plansData);

            if (subscriptions.length > 0) {

                const sub =
                    subscriptions.find(s =>
                        ["active", "trial", "paused"].includes(s.status)
                    ) || subscriptions[0];

                setSubscription(sub);

                if (Array.isArray(historyData)) {

                    const changes = [...historyData].sort(
                        (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    );

                    setPlanChanges(changes);
                }

            } else {

                setSubscription(null);

            }

        } catch {

            toast.error("Unable to load subscription.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    const handleAction = async (action) => {

    try {

        setActionLoading(true);

        let updatedSubscription;

        if (action === "pause") {

            updatedSubscription = await pauseMySubscription();

            toast.success("Subscription paused.");

        }

        else if (action === "resume") {

            updatedSubscription = await resumeMySubscription();

            toast.success("Subscription resumed.");

        }

        else if (action === "cancel") {

            updatedSubscription = await cancelMySubscription();

            toast.success("Subscription cancelled.");

        }

        // Update UI immediately
        if (updatedSubscription) {
            setSubscription(updatedSubscription);
        }

        // Reload everything (plans, history, etc.)
        await loadData();

    } catch (err) {

        console.error(err);

        toast.error("Operation failed.");

    } finally {

        setActionLoading(false);

    }

};

    if (loading) {

        return (

            <CustomerLayout>

                <div className="customer-subscription">

                    Loading...

                </div>

            </CustomerLayout>

        );

    }

    if (!subscription) {

        return (

            <CustomerLayout>

                <div className="customer-subscription">

                    No subscription found.

                </div>

            </CustomerLayout>

        );

    }

    const currentPlan =
        plans.find(
            p => p.id === subscription.plan_id
        );

    return (

        <CustomerLayout>

            <div className="customer-subscription">

                <div className="subscription-header">

                    <h1>My Subscription</h1>

                    <p>

                        View and manage your active subscription.
                        Pause, resume or cancel anytime.

                    </p>

                </div>

                {/* ── Info cards ── */}
                <div className="subscription-grid">

                    <div className="info-card">

                        <FaCreditCard className="info-icon"/>

                        <span>Current Plan</span>

                        <h3>

                            {currentPlan?.name || "-"}

                        </h3>

                    </div>

                    <div className="info-card">

                        <FaLayerGroup className="info-icon"/>

                        <span>Status</span>
                        <div className="status-container">

                        <StatusBadge
                            status={subscription.status}
                        />
                        </div>
                    </div>

                    <div className="info-card">

                        <FaCalendarAlt className="info-icon"/>

                        <span>Renewal</span>

                        <h3>

                            {new Date(
                                subscription.end_date
                            ).toLocaleDateString(
                                "en-GB",
                                {
                                    day:"2-digit",
                                    month:"short",
                                    year:"numeric"
                                }
                            )}

                        </h3>

                    </div>

                    <div className="info-card">

                        <FaBox className="info-icon"/>

                        <span>Subscription ID</span>

                        <h3>

                            #{subscription.id}

                        </h3>

                    </div>

                </div>

                {/* ── Action buttons ── */}
                <Card>

                    <div className="subscription-actions">

                        {(subscription.status === "active" ||
                            subscription.status === "trial") && (

                            <>
                                <button
                                    className="pause-btn"
                                    disabled={actionLoading}
                                    onClick={() => {
                                        setPendingAction("pause");
                                        setConfirmOpen(true);
                                    }}
                                >

                                    Pause

                                </button>

                                <button
                                    className="cancel-btn"
                                    disabled={actionLoading}
                                    onClick={() => {
                                        setPendingAction("cancel");
                                        setConfirmOpen(true);
                                    }}
                                >

                                    Cancel

                                </button>

                            </>

                        )}

                        {subscription.status === "paused" && (

                            <button
                                className="resume-btn"
                                disabled={actionLoading}
                                onClick={() => {
                                    setPendingAction("resume");
                                    setConfirmOpen(true);
                                }}
                            >

                                Resume

                            </button>

                        )}

                        {subscription.status === "cancelled" && (

                            <div className="cancelled-message">

                                Subscription Cancelled

                            </div>

                        )}

                        {subscription.status === "past_due" && (
                            <div className="pastdue-message">
                                Your subscription payment is overdue. Please complete payment to continue using your plan.
                            </div>
                        )}

                        {subscription.status === "expired" && (
                            <div className="expired-message">
                                Your subscription has expired. Please subscribe to a new plan.
                            </div>
                        )}

                    </div>

                </Card>

                {/* ── Plan Change History ── */}
                {planChanges.length > 0 && (

                    <div className="plan-change-history">

                        <div className="plan-change-history-header">

                            <FaExchangeAlt className="history-icon" />

                            <h2>Previous Plan Changes</h2>

                        </div>

                        <div className="plan-change-list">

                            {planChanges.map((log) => {

                                const changedDate = new Date(
                                    log.created_at
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                });

                                return (

                                    <div
                                        key={log.id}
                                        className="plan-change-item"
                                    >

                                        <div className="plan-change-icon">
                                            <FaExchangeAlt />
                                        </div>

                                        <div className="plan-change-details">

                                            <div className="plan-change-route">

                                                <span className="old-plan">
                                                    {log.old_value}
                                                </span>

                                                <span className="route-arrow">→</span>

                                                <span className="new-plan">
                                                    {log.new_value}
                                                </span>

                                            </div>

                                            <div className="plan-change-meta">

                                                <span className="change-date">
                                                    {changedDate}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                )}

            </div>

            <ConfirmationModal
                open={confirmOpen}
                title={
                    pendingAction === "pause"
                        ? "Pause Subscription?"
                        : pendingAction === "resume"
                        ? "Resume Subscription?"
                        : "Cancel Subscription?"
                }
                description="Are you sure you want to continue?"
                confirmText="Yes"
                cancelText="No"
                loading={actionLoading}
                onClose={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    await handleAction(pendingAction);
                    setConfirmOpen(false);
                }}
            />

        </CustomerLayout>

    );

}

export default MySubscription;