import {
    FaDownload,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";

function RecentInvoices({ invoices = [], loading }) {

    const statusBadge = (status) => {

        switch (status?.toLowerCase()) {

            case "paid":
                return (
                    <span className="status paid">
                        <FaCheckCircle />
                        Paid
                    </span>
                );

            case "pending":
                return (
                    <span className="status pending">
                        <FaClock />
                        Pending
                    </span>
                );

            default:
                return (
                    <span className="status failed">
                        <FaTimesCircle />
                        Failed
                    </span>
                );
        }

    };

    if (loading) {

        return (

            <div className="recent-invoices card">

                <div className="section-header">

                    <h2>Recent Invoices</h2>

                </div>

                <p>Loading invoices...</p>

            </div>

        );

    }

    return (

        <div className="recent-invoices card">

            <div className="section-header">

                <h2>Recent Invoices</h2>

            </div>

            <table className="invoice-table">

                <thead>

                    <tr>

                        <th>Invoice</th>

                        <th>Date</th>

                        <th>Amount</th>

                        <th>Status</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {invoices.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                style={{ textAlign: "center" }}
                            >

                                No invoices found.

                            </td>

                        </tr>

                    ) : (

                        invoices.map((invoice) => (

                            <tr key={invoice.id}>

                                <td>
                                    {invoice.invoice_number || `INV-${invoice.id}`}
                                </td>

                                <td>
                                    {new Date(
                                        invoice.invoice_date || invoice.issue_date
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    {(invoice.total_amount !== undefined ? invoice.total_amount : invoice.amount) < 0 ? (
                                        <span style={{ color: "#16a34a", fontWeight: "600" }}>
                                            ₹{Math.abs(invoice.total_amount !== undefined ? invoice.total_amount : invoice.amount).toFixed(2)} (Credit)
                                        </span>
                                    ) : (
                                        `₹${Number(invoice.total_amount !== undefined ? invoice.total_amount : invoice.amount || 0).toFixed(2)}`
                                    )}
                                </td>

                                <td>
                                    {statusBadge(invoice.status)}
                                </td>

                                <td>

                                    <button className="download-btn">

                                        <FaDownload />

                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default RecentInvoices;