import CustomerLayout from "../../layouts/CustomerLayout";
import { useAuth } from "../../context/AuthContext";
import SubscriptionOverview from "../../components/customer/SubscriptionOverview";
import BillingSummary from "../../components/customer/BillingSummary";
import QuickActions from "../../components/customer/QuickActions";
import RecentInvoices from "../../components/customer/RecentInvoices";
import ActivityTimeline from "../../components/customer/ActivityTimeline";
import { useEffect, useState } from "react";
import {
    getSubscriptions,
    getMyInvoices,
    getMyPayments,
} from "../../services/api";
import "../../styles/customer/customer-dashboard.css";

function CustomerDashboard() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
const [invoices, setInvoices] = useState([]);
const [payments, setPayments] = useState([]);

const [loading, setLoading] = useState(true);

useEffect(() => {

    const loadDashboard = async () => {

        try {

            const [subs, invs, pays] = await Promise.all([
                getSubscriptions(),
                getMyInvoices(),
                getMyPayments(),
            ]);

            setSubscriptions(subs);
            setInvoices(invs);
            setPayments(pays);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    loadDashboard();

}, []);
    return (
        <CustomerLayout>

            <div className="dashboard">

                <div className="welcome-banner">

                    <div>
                        <h1>
    Welcome back, {user?.name || "Customer"} 👋
</h1>

                        <p>
                            Manage your subscription, invoices and payments
                            from one place.
                        </p>
                    </div>

                    <div className="welcome-badge">

                        <span>Professional Plan</span>

                        <small>ACTIVE</small>

                    </div>

                </div>

                <div className="dashboard-top">

                    <SubscriptionOverview
    subscriptions={subscriptions}
    loading={loading}
/>

                    <BillingSummary
    invoices={invoices}
    payments={payments}
    loading={loading}
/>

                </div>

                <QuickActions />

                <div className="dashboard-bottom">

                    <div className="dashboard-left">

                        <RecentInvoices
    invoices={invoices}
    loading={loading}
/>

                    </div>

                    <div className="dashboard-right">

                        <ActivityTimeline />

                    </div>

                </div>

            </div>

        </CustomerLayout>
    );
}

export default CustomerDashboard;