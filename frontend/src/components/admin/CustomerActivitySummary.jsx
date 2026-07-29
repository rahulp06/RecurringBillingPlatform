import { useEffect, useState } from "react";
import { getCustomerActivitySummary } from "../../services/api";
import "../../styles/admin/customer-activity-summary.css";
export default function CustomerActivitySummary({ customerId }) {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        if (!customerId) return;

        loadSummary();
    }, [customerId]);

    const loadSummary = async () => {
        try {
            const data = await getCustomerActivitySummary(customerId);
            setSummary(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!summary)
        return <p>Loading...</p>;

    return (
        <div className="dashboard-section">

        <h2 className="section-title">
            Customer Activity
        </h2>

        <div className="kpi-grid">

            <Card title="Subscriptions" value={summary.total_subscriptions} />
            <Card title="Invoices" value={summary.total_invoices} />
            <Card title="Paid" value={summary.paid_invoices} />
            <Card title="Pending" value={summary.pending_invoices} />
            <Card title="Failed" value={summary.failed_payments} />
            <Card title="Refunds" value={summary.refunds} />
            <Card title="Total Paid" value={`₹${summary.total_paid_amount}`} />

        </div>

    </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="kpi-card">
            <div className="kpi-title">{title}</div>
            <div className="kpi-value">{value}</div>
        </div>
    );
}