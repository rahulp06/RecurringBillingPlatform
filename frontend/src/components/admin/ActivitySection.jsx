import { useEffect, useState } from "react";
import {
    FaArrowRight,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
} from "react-icons/fa";

import {
    getPayments,
    getInvoices,
    getSubscriptions,
    getCustomers,
    getPlans
} from "../../services/api";

import "../../styles/admin/admin-dashboard.css";

function ActivitySection() {

    const [payments, setPayments] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {

        loadDashboardActivity();

    }, []);

    const loadDashboardActivity = async () => {

        try {

            const [
                paymentData,
                invoiceData,
                subscriptionData,
                customerData,
                planData
            ] = await Promise.all([
                getPayments(),
                getInvoices(),
                getSubscriptions(),
                getCustomers(),
                getPlans()
            ]);

            // ==========================
            // Recent Payments
            // ==========================

            const latestPayments = paymentData
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.payment_date) -
                        new Date(a.payment_date)
                )
                .slice(0, 5)
                .map(payment => {

                    const invoice = invoiceData.find(
                        inv => inv.id === payment.invoice_id
                    );

                    const subscription = subscriptionData.find(
                        sub => sub.id === invoice?.subscription_id
                    );

                    const customer = customerData.find(
                        c => c.id === subscription?.customer_id
                    );

                    const plan = planData.find(
                        p => p.id === subscription?.plan_id
                    );

                    return {

                        customer:
                            customer?.name || "Unknown",

                        plan:
                            plan?.name || "Unknown",

                        amount:
                            `₹${payment.amount}`,

                        status:
                            payment.status || "Unknown"

                    };

                });

            setPayments(latestPayments);

            // ==========================
            // Recent Activity
            // ==========================

            const latestActivities = subscriptionData
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.status_changed_at) -
                        new Date(a.status_changed_at)
                )
                .slice(0, 5)
                .map(sub => {

                    const customer = customerData.find(
                        c => c.id === sub.customer_id
                    );

                    let icon = <FaCheckCircle />;
                    let color = "#10B981";
                    let title = "Subscription Activated";

                    switch (sub.status?.toLowerCase()) {

                        case "trial":
                            icon = <FaClock />;
                            color = "#F59E0B";
                            title = "Trial Started";
                            break;

                        case "cancelled":
                            icon = <FaTimesCircle />;
                            color = "#EF4444";
                            title = "Subscription Cancelled";
                            break;

                        case "active":
                            icon = <FaCheckCircle />;
                            color = "#10B981";
                            title = "Subscription Activated";
                            break;

                        case "paused":
                            icon = <FaClock />;
                            color = "#3B82F6";
                            title = "Subscription Paused";
                            break;

                        default:
                            break;

                    }

                    return {

                        icon,

                        color,

                        title,

                        user:
                            customer?.name || "Unknown Customer",

                        time:
                            new Date(
                                sub.status_changed_at
                            ).toLocaleDateString("en-GB")

                    };

                });

            setActivities(latestActivities);

        } catch (err) {

            console.error("Dashboard Activity Error:", err);

        }

    };

    return (

        <div className="activity-grid">

            {/* Recent Payments */}

            <div className="analytics-card">

                <div className="card-header">

                    <h3>

                        Recent Payments

                    </h3>

                    <button className="view-all">

                        View All

                        <FaArrowRight />

                    </button>

                </div>

                <table className="recent-table">

                    <thead>

                        <tr>

                            <th>Customer</th>

                            <th>Plan</th>

                            <th>Amount</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {payments.map((payment, index) => (

                            <tr key={index}>

                                <td>{payment.customer}</td>

                                <td>{payment.plan}</td>

                                <td>{payment.amount}</td>

                                <td>

                                    <span
                                        className={`status ${payment.status.toLowerCase()}`}
                                    >

                                        {payment.status}

                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Recent Activity */}

            <div className="analytics-card">

                <div className="card-header">

                    <h3>

                        Recent Activity

                    </h3>

                </div>

                <div className="activity-list">

                    {activities.map((item, index) => (

                        <div
                            key={index}
                            className="activity-item"
                        >

                            <div
                                className="activity-icon"
                                style={{
                                    background: item.color
                                }}
                            >

                                {item.icon}

                            </div>

                            <div className="activity-content">

                                <h4>

                                    {item.title}

                                </h4>

                                <p>

                                    {item.user}

                                </p>

                            </div>

                            <span className="activity-time">

                                {item.time}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default ActivitySection;