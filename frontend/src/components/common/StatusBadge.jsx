function StatusBadge({ status }) {

    const value = (status || "").toLowerCase();

    const labels = {
        active: "Active",
        trial: "Trial",
        paused: "Paused",
        cancelled: "Cancelled",
        past_due: "Past Due",
    };

    return (

        <span className={`status-badge ${value}`}>

            {labels[value] || status}

        </span>

    );

}

export default StatusBadge;