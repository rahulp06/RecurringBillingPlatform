import {
    FaArrowTrendUp,
    FaUsers,
    FaMoneyBillWave,
    FaFileInvoiceDollar
} from "react-icons/fa6";

import "../../styles/admin/admin-dashboard.css";

function KPISection({ dashboard }) {

    const {
        customers,
        invoices,
        payments,
        subscriptions
    } = dashboard;

    const paidPayments = payments.filter(
        payment =>
            payment.status?.toLowerCase() === "paid"
    );

    const totalRevenue = paidPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
    );

    const monthlyRevenue = paidPayments
        .filter(payment => {

            const paymentDate = new Date(
                payment.payment_date
            );

            const today = new Date();

            return (

                paymentDate.getMonth() ===
                    today.getMonth() &&

                paymentDate.getFullYear() ===
                    today.getFullYear()

            );

        })
        .reduce(
            (sum, payment) =>
                sum + payment.amount,
            0
        );

    const cards = [

        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            change: `${subscriptions.length} Active`,
            icon: <FaMoneyBillWave />,
            color: "#635BFF"
        },

        {
            title: "Monthly Revenue",
            value: `₹${monthlyRevenue.toLocaleString()}`,
            change: "Current Month",
            icon: <FaArrowTrendUp />,
            color: "#10B981"
        },

        {
            title: "Customers",
            value: customers.length,
            change: "Registered",
            icon: <FaUsers />,
            color: "#F59E0B"
        },

        {
            title: "Invoices",
            value: invoices.length,
            change: "Generated",
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
                        style={{
                            background: card.color
                        }}
                    >

                        {card.icon}

                    </div>

                    <span className="kpi-title">

                        {card.title}

                    </span>

                    <h2>

                        {card.value}

                    </h2>

                    <p className="kpi-change">

                        {card.change}

                    </p>

                </div>

            ))}

        </div>

    );

}

export default KPISection;