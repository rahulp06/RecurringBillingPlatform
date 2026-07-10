import {
    FaBoxOpen,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";

function SubscriptionOverview({
    subscriptions = [],
    loading,
}) {

    if (loading) {

        return (

            <div className="card">

                <div className="section-header">

                    <h2>Subscription Overview</h2>

                </div>

                <p>Loading...</p>

            </div>

        );

    }

    if (subscriptions.length === 0) {

        return (

            <div className="card">

                <div className="section-header">

                    <h2>Subscription Overview</h2>

                </div>

                <p>No active subscription found.</p>

            </div>

        );

    }

    const subscription = subscriptions[0];

    const overview = [

        {
            title: "Subscription ID",
            value: `#${subscription.id}`,
            icon: <FaBoxOpen />,
            color: "",
        },

        {
            title: "Status",
            value: subscription.status,
            icon: <FaCheckCircle />,
            color: "success",
        },

        {
            title: "Start Date",
            value: new Date(
                subscription.start_date
            ).toLocaleDateString(),
            icon: <FaCalendarAlt />,
            color: "",
        },

        {
            title: "Renewal",
            value: new Date(
                subscription.end_date
            ).toLocaleDateString(),
            icon: <FaClock />,
            color: "warning",
        },

    ];

    return (

        <div className="card">

            <div className="section-header">

                <h2>Subscription Overview</h2>

            </div>

            <div className="overview-grid">

                {overview.map((item) => (

                    <div
                        key={item.title}
                        className="overview-item"
                    >

                        <div
                            className={`overview-icon ${item.color}`}
                        >

                            {item.icon}

                        </div>

                        <div>

                            <span>{item.title}</span>

                            <h3>{item.value}</h3>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default SubscriptionOverview;