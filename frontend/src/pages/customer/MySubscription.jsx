import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    FaCalendarAlt,
    FaCreditCard,
    FaBox,
    FaLayerGroup,
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
} from "../../services/api";

import "../../styles/customer/customer-subscription.css";

function MySubscription() {

    const [subscription, setSubscription] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
const [pendingAction, setPendingAction] = useState(null);
    const loadData = async () => {

        try {

            const [subscriptions, plansData] = await Promise.all([
                getSubscriptions(),
                getPlans(),
            ]);

            setPlans(plansData);

            if (subscriptions.length > 0) {

                setSubscription(subscriptions[0]);

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

            if (action === "pause")
                await pauseMySubscription();

            if (action === "resume")
                await resumeMySubscription();

            if (action === "cancel")
                await cancelMySubscription();

            toast.success("Subscription updated.");

            await loadData();

        } catch {

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

                </div>
                </Card>

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