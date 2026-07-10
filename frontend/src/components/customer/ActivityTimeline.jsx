import {
    FaCheckCircle,
    FaFileInvoiceDollar,
    FaCreditCard,
    FaPlayCircle,
    FaArrowUp,
} from "react-icons/fa";

function ActivityTimeline() {

    const activities = [
        {
            title: "Payment Received",
            description: "₹999 payment was successfully processed.",
            time: "2 hours ago",
            icon: <FaCreditCard />,
        },
        {
            title: "Invoice Generated",
            description: "Invoice INV-1008 has been generated.",
            time: "Yesterday",
            icon: <FaFileInvoiceDollar />,
        },
        {
            title: "Subscription Activated",
            description: "Professional Plan is now active.",
            time: "20 Jul 2026",
            icon: <FaCheckCircle />,
        },
        {
            title: "Trial Started",
            description: "14-day trial period has begun.",
            time: "06 Jul 2026",
            icon: <FaPlayCircle />,
        },
        {
            title: "Plan Upgraded",
            description: "Upgraded from Starter to Professional.",
            time: "01 Jul 2026",
            icon: <FaArrowUp />,
        },
    ];

    return (

        <div className="activity-timeline card">

            <div className="section-header">
                <h2>Recent Activity</h2>
            </div>

            <div className="timeline">

                {activities.map((activity, index) => (

                    <div
                        key={index}
                        className="timeline-item"
                    >

                        <div className="timeline-icon">

                            {activity.icon}

                        </div>

                        <div className="timeline-content">

                            <h4>{activity.title}</h4>

                            <p>{activity.description}</p>

                            <span>{activity.time}</span>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default ActivityTimeline;