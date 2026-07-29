import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CustomerTimeline from "../../components/admin/CustomerTimeline";
import CustomerActivitySummary from "../../components/admin/CustomerActivitySummary";
import SubscriptionHistory from "../../components/admin/SubscriptionHistory";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";

import { getSubscriptions } from "../../services/api";

export default function CustomerDetails() {

    const { id } = useParams();

    const [subscriptionId, setSubscriptionId] = useState(null);

    useEffect(() => {
        loadSubscription();
    }, [id]);

    const loadSubscription = async () => {
        try {
            const subscriptions = await getSubscriptions();

            const customerSubscriptions = subscriptions
                .filter(s => s.customer_id === Number(id))
                .sort(
                    (a, b) =>
                        new Date(b.status_changed_at) -
                        new Date(a.status_changed_at)
                );

            if (customerSubscriptions.length > 0) {
                setSubscriptionId(customerSubscriptions[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="layout">

            <Sidebar />

            <div className="main">

                <Topbar />

                <div className="dashboard">

                    <h1>Customer Details</h1>

                    <CustomerActivitySummary customerId={id} />

                    <CustomerTimeline customerId={id} />

                    {
                        subscriptionId &&
                        <SubscriptionHistory
                            subscriptionId={subscriptionId}
                        />
                    }

                </div>

            </div>

        </div>
    );

}