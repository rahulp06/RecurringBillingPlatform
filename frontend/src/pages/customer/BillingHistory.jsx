import { useEffect, useState } from "react";

import CustomerLayout from "../../layouts/CustomerLayout";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

import { getMyInvoices } from "../../services/api";

import "../../styles/customer/customer-billing-history.css";

function BillingHistory() {

    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadInvoices();

    }, []);

    useEffect(() => {

        const filtered = invoices.filter((invoice) =>

            invoice.invoice_number
                .toLowerCase()
                .includes(search.toLowerCase())

        );

        setFilteredInvoices(filtered);

    }, [search, invoices]);

    const loadInvoices = async () => {

        try {

            const data = await getMyInvoices();

            setInvoices(data);
            setFilteredInvoices(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <CustomerLayout>

                <LoadingSpinner />

            </CustomerLayout>

        );

    }

    return (

        <CustomerLayout>

            <div className="customer-billing">

                <PageHeader

                    title="Billing History"

                    subtitle="View all invoices and payments."

                />

                <Card>

                    <input

                        className="invoice-search"

                        placeholder="Search Invoice Number..."

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                    />

                </Card>

                <div style={{height:"20px"}} />

                {filteredInvoices.length === 0 ? (

                    <Card>

                        <EmptyState

                            title="No Invoices"

                            description="Invoices will appear here after your first billing cycle."

                        />

                    </Card>

                ) : (

                    <Card>

                        <table className="invoice-table">

                            <thead>

                                <tr>

                                    <th>Invoice</th>

                                    <th>Date</th>

                                    <th>Amount</th>

                                    <th>Status</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredInvoices.map((invoice) => (

                                    <tr key={invoice.id}>

                                        <td>

                                            {invoice.invoice_number}

                                        </td>

                                        <td>

                                            {new Date(
                                                invoice.invoice_date
                                            ).toLocaleDateString(
                                                "en-GB"
                                            )}

                                        </td>

                                        <td>

                                            ₹{invoice.total_amount}

                                        </td>

                                        <td>

                                            <StatusBadge

                                                status={invoice.status}

                                            />

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </Card>

                )}

            </div>

        </CustomerLayout>

    );

}

export default BillingHistory;