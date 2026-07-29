import { useEffect, useState } from "react";
import { getCustomerBillingHistory } from "../../services/api";

import "../../styles/admin/customer-timeline.css";

export default function CustomerTimeline({ customerId }) {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (customerId) {
            loadTimeline();
        }
    }, [customerId]);

    const loadTimeline = async () => {
        try {
            const data = await getCustomerBillingHistory(customerId);
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="timeline-section">

            <h2>Billing Timeline</h2>

            {
                events.length === 0
                    ? (
                        <p>No activity found.</p>
                    )
                    : (
                        <div className="timeline">

                            {
                                events.map((event, index) => (

                                    <div
                                        key={index}
                                        className="timeline-item"
                                    >

                                        <div className="timeline-dot" />

                                        <div className="timeline-content">

                                            <h4>{event.event}</h4>

                                            <p>
                                                <span className="timeline-entity">
                                                    {event.entity}
                                                </span>

                                                {event.details}
                                            </p>

                                            <small>
                                                {new Date(event.date).toLocaleString()}
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