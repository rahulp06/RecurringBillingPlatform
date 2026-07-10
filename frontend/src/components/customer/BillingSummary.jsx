import {
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaFileInvoiceDollar,
} from "react-icons/fa";

function BillingSummary({
    invoices = [],
    payments = [],
    loading,
}) {

    if (loading) {

        return (

            <div className="card">

                <div className="section-header">

                    <h2>Billing Summary</h2>

                </div>

                <p>Loading...</p>

            </div>

        );

    }

    const totalInvoices = invoices.length;

    const paidInvoices = invoices.filter(
        invoice => invoice.status?.toLowerCase() === "paid"
    ).length;

    const pendingInvoices = invoices.filter(
        invoice => invoice.status?.toLowerCase() === "pending"
    ).length;

    const totalPaid = payments
        .filter(payment => payment.status?.toLowerCase() === "paid")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const stats = [
        {
            title: "Total Paid",
            value: `₹${totalPaid.toFixed(2)}`,
            icon: <FaMoneyBillWave />,
            className: "success",
        },
        {
            title: "Invoices",
            value: totalInvoices,
            icon: <FaFileInvoiceDollar />,
            className: "primary",
        },
        {
            title: "Paid",
            value: paidInvoices,
            icon: <FaCheckCircle />,
            className: "info",
        },
        {
            title: "Pending",
            value: pendingInvoices,
            icon: <FaClock />,
            className: "warning",
        },
    ];

    return (

        <div className="card">

            <div className="section-header">

                <h2>Billing Summary</h2>

            </div>

            <div className="billing-grid">

                {stats.map((stat) => (

                    <div
                        key={stat.title}
                        className="billing-stat-card"
                    >

                        <div
                            className={`billing-icon ${stat.className}`}
                        >

                            {stat.icon}

                        </div>

                        <div>

                            <span>{stat.title}</span>

                            <h3>{stat.value}</h3>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default BillingSummary;