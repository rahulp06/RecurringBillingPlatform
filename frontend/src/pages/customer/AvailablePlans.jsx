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
    getMe,
    previewMyPlanProration,
} from "../../services/api";

import "../../styles/customer/customer-plans.css";

function AvailablePlans() {

    const [plans, setPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    const [loading, setLoading] = useState(true);

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [prorateInfo, setProrateInfo] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
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

    /* -----------------------------------------------
       Open modal with proration preview pre-fetched
    ----------------------------------------------- */
    const openChangePlanModal = async (plan) => {

        setSelectedPlan(plan);
        setProrateInfo(null);
        setModalOpen(true);           // open modal immediately (shows spinner)
        setPreviewLoading(true);

        try {

            const preview = await previewMyPlanProration(plan.id);
            setProrateInfo(preview);

        } catch (err) {

            // Don't close the modal — still let the user confirm without the breakdown
            console.warn("Proration preview failed:", err.message);
            toast.warn("Could not load proration details. You can still proceed.");

        } finally {

            setPreviewLoading(false);

        }

    };

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

            setProrateInfo(null);

        }

        catch (err) {

            console.error(err);

            toast.error("Unable to change plan.");

        }

        finally {

            setUpdating(false);

        }

    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPlan(null);
        setProrateInfo(null);
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
                                    disabled={isCurrent || updating || previewLoading}
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
                                        // Existing subscription — fetch preview then open modal
                                        // -----------------------------
                                        else {

                                            await openChangePlanModal(plan);

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
                prorateInfo={previewLoading ? null : prorateInfo}
                onClose={closeModal}
                onConfirm={handleChangePlan}
                loading={updating || previewLoading}
            />

        </CustomerLayout>

    );

}

export default AvailablePlans;