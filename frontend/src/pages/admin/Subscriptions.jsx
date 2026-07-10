import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import SubscriptionModal from "../../components/admin/SubscriptionModal";

import {
    getSubscriptions,
    getCustomers,
    getPlans,
    createSubscription,
    updateSubscription,
    deleteSubscription
} from "../../services/api";

function Subscriptions() {

    const [subscriptions, setSubscriptions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [editSubscription, setEditSubscription] = useState(null);

    useEffect(() => {

        loadSubscriptions();

    }, []);

    const loadSubscriptions = async () => {

        setLoading(true);

        try {

            const [
                subscriptionData,
                customerData,
                planData
            ] = await Promise.all([

                getSubscriptions(),
                getCustomers(),
                getPlans()

            ]);

            setCustomers(Array.isArray(customerData) ? customerData : []);
            setPlans(Array.isArray(planData) ? planData : []);

            const formatted = Array.isArray(subscriptionData)

                ? subscriptionData.map(subscription => ({

                    id: subscription.id,

                    customer:
                        customerData.find(c => c.id === subscription.customer_id)?.name || "-",

                    plan:
                        planData.find(p => p.id === subscription.plan_id)?.name || "-",

                    customer_id: subscription.customer_id,
                    plan_id: subscription.plan_id,

                    status: subscription.status,

                    start_date: subscription.start_date,

                    end_date: subscription.end_date

                }))

                : [];

            setSubscriptions(formatted);

        }

        finally {

            setLoading(false);

        }

    };

    const handleEdit = (subscription) => {

        setEditSubscription(subscription);

        setOpenModal(true);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this subscription?")) return;

        try {

            await deleteSubscription(id);

            toast.success("Subscription deleted.");

            loadSubscriptions();

        }

        catch {

            toast.error("Unable to delete.");

        }

    };

    const handleSave = async (form) => {

        try {

            if (editSubscription) {

                await updateSubscription(editSubscription.id, form);

                toast.success("Subscription updated.");

            }

            else {

                await createSubscription(form);

                toast.success("Subscription created.");

            }

            setOpenModal(false);

            loadSubscriptions();

        }

        catch {

            toast.error("Operation failed.");

        }

    };

    return (

        <div className="layout">

            <Sidebar />

            <div className="main">

                <Topbar />

                <div className="dashboard">

                    <div className="page-header">

                        <div>

                            <h1>Subscriptions</h1>

                            <p>Manage customer subscriptions.</p>

                        </div>

                        <button

                            className="primary-btn"

                            onClick={() => {

                                setEditSubscription(null);

                                setOpenModal(true);

                            }}

                        >

                            + Create Subscription

                        </button>

                    </div>

                    {

                        loading

                            ?

                            <Loading />

                            :

                            subscriptions.length === 0

                                ?

                                <EmptyState

                                    title="No Subscriptions"

                                    message="No subscriptions found."

                                />

                                :

                                <DataTable

                                    title="Subscriptions"

                                    subtitle="Customer subscriptions"

                                    columns={[

                                        "Customer",
                                        "Plan",
                                        "Status",
                                        "Start Date",
                                        "End Date",
                                        "Actions"

                                    ]}

                                    data={subscriptions}

                                    onEdit={handleEdit}

                                    onDelete={handleDelete}

                                />

                    }

                </div>

            </div>

            <SubscriptionModal

                open={openModal}

                editSubscription={editSubscription}

                customers={customers}

                plans={plans}

                onClose={() => setOpenModal(false)}

                onSave={handleSave}

            />

        </div>

    );

}

export default Subscriptions;