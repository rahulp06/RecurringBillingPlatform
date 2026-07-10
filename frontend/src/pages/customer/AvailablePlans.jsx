import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

import CustomerLayout from "../../layouts/CustomerLayout";
import ChangePlanModal from "../../components/customer/ChangePlanModal";

import {
    getPlans,
    getSubscriptions,
    changeMyPlan,
    createSubscription,
    getMe
} from "../../services/api";

import "../../styles/customer/customer-plans.css";

function AvailablePlans() {

    const [plans, setPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    const [loading, setLoading] = useState(true);

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const loadData = async () => {

        try {

            const [plansData, subscriptionsData] = await Promise.all([
                getPlans(),
                getSubscriptions(),
            ]);

            setPlans(plansData);

            if (subscriptionsData.length > 0) {
                setCurrentSubscription(subscriptionsData[0]);
            }

        } catch (err) {

            console.error(err);

            toast.error("Failed to load plans.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    const handleChangePlan = async () => {

    try {

        setUpdating(true);

        const response = await changeMyPlan(selectedPlan.id);

        if (response.detail) {

            toast.error(response.detail);

            return;

        }

        toast.success("Plan changed successfully!");

        await loadData();

        setModalOpen(false);

        setSelectedPlan(null);

    }

    catch (err) {

        console.error(err);

        toast.error("Unable to change plan.");

    }

    finally {

        setUpdating(false);

    }

};

    if (loading) {

        return (

            <CustomerLayout>

                <div className="customer-plans">

                    <h2>Loading...</h2>

                </div>

            </CustomerLayout>

        );

    }

    return (

        <CustomerLayout>

            <div className="customer-plans">

                <div className="plans-header">

                    <h1>Available Plans</h1>

                    <p>
                        Choose the subscription that best fits your business.
                    </p>

                </div>

                <div className="plans-grid">

                    {plans.map((plan) => {

                        const isCurrent =
                            currentSubscription?.plan_id === plan.id;

                        return (

                            <div
                                key={plan.id}
                                className={`plan-card ${isCurrent ? "current-plan" : ""}`}
                            >

                                {isCurrent && (

                                    <span className="current-badge">

                                        ✓ Current

                                    </span>

                                )}

                                <h2>{plan.name}</h2>

                                <div className="plan-price">

                                    ₹{plan.price}

                                    <span>

                                        / {plan.billing_interval}

                                    </span>

                                </div>

                                <div className="trial-days">

                                    {plan.trial_days} Day Free Trial

                                </div>

                                <ul className="feature-list">

                                    {(plan.features || "")
                                        .split(",")
                                        .filter(feature => feature.trim() !== "")
                                        .map((feature, index) => (

                                            <li key={index}>

                                                <FaCheckCircle />

                                                {feature.trim()}

                                            </li>

                                        ))}

                                </ul>

                                <button
    className={
        isCurrent
            ? "current-btn"
            : "subscribe-btn"
    }
    disabled={isCurrent || updating}
    onClick={async () => {

        if (isCurrent) return;

        // -----------------------------
        // First subscription
        // -----------------------------
        if (!currentSubscription) {

            try {

                setUpdating(true);

                const user = await getMe();

                const response = await createSubscription({

                    customer_id: user.id,
                    plan_id: plan.id

                });

                if (response.detail) {

                    toast.error(response.detail);

                    return;

                }

                toast.success("Subscription created successfully!");

                await loadData();

            }

            catch (err) {

                console.error(err);

                toast.error("Unable to subscribe.");

            }

            finally {

                setUpdating(false);

            }

        }

        // -----------------------------
        // Existing subscription
        // -----------------------------
        else {

            setSelectedPlan(plan);

            setModalOpen(true);

        }

    }}
>

    {isCurrent
        ? "Current Plan"
        : "Subscribe"}

</button>

                            </div>

                        );

                    })}

                </div>

            </div>

            <ChangePlanModal
                open={modalOpen}
                plan={selectedPlan}
                currentPlan={
                    plans.find(
                        p => p.id === currentSubscription?.plan_id
                    )
                }
                onClose={() => {

                    setModalOpen(false);

                    setSelectedPlan(null);

                }}
                onConfirm={handleChangePlan}
                loading={updating}
            />

        </CustomerLayout>

    );

}

export default AvailablePlans;