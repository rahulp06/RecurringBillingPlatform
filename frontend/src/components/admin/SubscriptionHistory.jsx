import { useEffect, useState } from "react";
import { getSubscriptionHistory } from "../../services/api";

import "../../styles/admin/subscription-history.css";

export default function SubscriptionHistory({ subscriptionId }) {

    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (subscriptionId) {
            loadHistory();
        }
    }, [subscriptionId]);

    const loadHistory = async () => {
        try {
            const data = await getSubscriptionHistory(subscriptionId);
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="history-section">

            <h2>Subscription History</h2>

            {
                history.length === 0 ? (
                    <p>No subscription history found.</p>
                ) : (

                    <div className="history-timeline">

                        {
                            history.map((item, index) => (

                                <div
                                    key={index}
                                    className="history-item"
                                >

                                    <div className="history-dot"></div>

                                    <div className="history-content">

                                        <h4>{item.status}</h4>

                                        {
                                            item.details &&
                                            <p>{item.details}</p>
                                        }

                                        <small>
                                            {
                                                new Date(item.date)
                                                    .toLocaleString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "numeric",
                                                        minute: "2-digit"
                                                    })
                                            }
                                        </small>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>
    );

}