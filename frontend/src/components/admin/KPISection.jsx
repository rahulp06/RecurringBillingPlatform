import {
    FaArrowTrendUp,
    FaUsers,
    FaMoneyBillWave,
    FaFileInvoiceDollar
} from "react-icons/fa6";

import "../../styles/admin/admin-dashboard.css";

function KPISection({ dashboard }) {

    const cards = [
        {
            title: "MRR",
            value: `₹${Number(dashboard.mrr || 0).toLocaleString()}`,
            change: `${dashboard.active_subscriptions} Active`,
            icon: <FaMoneyBillWave />,
            color: "#635BFF"
        },
        {
            title: "Active Subscriptions",
            value: dashboard.active_subscriptions,
            change: "Currently Active",
            icon: <FaArrowTrendUp />,
            color: "#10B981"
        },
        {
            title: "Customers",
            value: dashboard.total_customers,
            change: "Registered",
            icon: <FaUsers />,
            color: "#F59E0B"
        },
        {
            title: "Cancelled",
            value: dashboard.cancelled_subscriptions,
            change: "Subscriptions",
            icon: <FaFileInvoiceDollar />,
            color: "#EF4444"
        }
    ];

    return (
        <div className="kpi-grid">
            {cards.map(card => (
                <div
                    key={card.title}
                    className="kpi-card"
                >
                    <div
                        className="kpi-icon"
                        style={{ background: card.color }}
                    >
                        {card.icon}
                    </div>

                    <span className="kpi-title">
                        {card.title}
                    </span>

                    <h2>{card.value}</h2>

                    <p className="kpi-change">
                        {card.change}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default KPISection;