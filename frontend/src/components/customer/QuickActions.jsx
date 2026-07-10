import {
    FaArrowUp,
    FaPause,
    FaFileInvoiceDollar,
    FaCreditCard,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function QuickActions() {

    const navigate = useNavigate();

    const actions = [
        {
            title: "Upgrade Plan",
            subtitle: "View available plans",
            icon: <FaArrowUp />,
            onClick: () => navigate("/customer/plans"),
        },
        {
            title: "Pause Subscription",
            subtitle: "Temporarily stop billing",
            icon: <FaPause />,
            onClick: () => navigate("/customer/subscription"),
        },
        {
            title: "Billing History",
            subtitle: "View invoices & payments",
            icon: <FaFileInvoiceDollar />,
            onClick: () => navigate("/customer/billing-history"),
        },
        {
            title: "Payment Methods",
            subtitle: "Manage your billing",
            icon: <FaCreditCard />,
            onClick: () => navigate("/customer/profile"),
        },
    ];

    return (
        <div className="quick-actions card">

            <div className="section-header">
                <h2>Quick Actions</h2>
            </div>

            <div className="action-grid">

                {actions.map((action) => (
                    <div
                        key={action.title}
                        className="action-card"
                        onClick={action.onClick}
                    >
                        <div className="action-icon">
                            {action.icon}
                        </div>

                        <div>
                            <h3>{action.title}</h3>
                            <p>{action.subtitle}</p>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default QuickActions;