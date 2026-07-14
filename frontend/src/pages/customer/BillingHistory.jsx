import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

import CustomerLayout from "../../layouts/CustomerLayout";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import InvoiceDetailModal from "../../components/common/InvoiceDetailModal";

import { useAuth } from "../../context/AuthContext";
import { getMyInvoices, getPlans, getSubscriptions } from "../../services/api";

import "../../styles/customer/customer-billing-history.css";

function BillingHistory() {
    const { user } = useAuth();

    const [invoices, setInvoices] = useState([]);
    const [plans, setPlans] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(true);

    // Detail modal state
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {

        loadInvoices();

    }, []);

    const loadInvoices = async () => {

        try {

            const [invoiceData, plansData, subscriptionData] = await Promise.all([
                getMyInvoices(),
                getPlans(),
                getSubscriptions()
            ]);

            setInvoices(invoiceData);
            setPlans(plansData);
            setSubscriptions(subscriptionData);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleViewInvoice = (invoice) => {
        // Resolve plan details for the invoice
        const subscription = subscriptions.find(s => s.id === invoice.subscription_id) || {};
        const plan = plans.find(p => p.id === subscription.plan_id) || {};

        const enrichedInvoice = {
            ...invoice,
            plan_name: plan.name || "Subscription Plan",
            plan_interval: plan.billing_interval || "Monthly"
        };

        setSelectedInvoice(enrichedInvoice);
        setDetailModalOpen(true);
    };

    // Filter dynamic invoices list
    const filteredInvoices = invoices.filter((invoice) => {
        // Search filter (by invoice number)
        if (search && !invoice.invoice_number.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Status filter
        if (statusFilter !== "all" && invoice.status.toLowerCase() !== statusFilter.toLowerCase()) {
            return false;
        }

        // Date range filter
        if (startDate && invoice.invoice_date < startDate) {
            return false;
        }
        if (endDate && invoice.invoice_date > endDate) {
            return false;
        }

        return true;
    });

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
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <input

                                className="invoice-search"

                                placeholder="Search Invoice Number..."

                                value={search}

                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={{ margin: 0, width: "100%" }}

                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "white"
                                }}
                            >
                                <option value="all">All</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            />
                        </div>

                        {(search || statusFilter !== "all" || startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                style={{
                                    marginTop: "16px",
                                    padding: "8px 15px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    background: "#f8fafc",
                                    color: "#64748b",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    fontWeight: "500"
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                </Card>

                <div style={{height:"20px"}} />

                {filteredInvoices.length === 0 ? (

                    <Card>

                        <EmptyState

                            title="No Invoices"

                            description="No invoices match the specified criteria."

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

                                    <th style={{ textAlign: "right" }}>Actions</th>

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

                                            {invoice.total_amount < 0 ? (
                                                <span style={{ color: "#16a34a", fontWeight: "600" }}>
                                                    ₹{Math.abs(invoice.total_amount).toFixed(2)} (Credit)
                                                </span>
                                            ) : (
                                                `₹${Number(invoice.total_amount || 0).toFixed(2)}`
                                            )}

                                        </td>

                                        <td>

                                            <StatusBadge

                                                status={invoice.status}

                                            />

                                        </td>

                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() => handleViewInvoice(invoice)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#4f46e5",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                <FaEye /> View
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </Card>

                )}

            </div>

            <InvoiceDetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                invoice={selectedInvoice}
                customerName={user?.name}
                customerEmail={user?.email}
                customerCompany={user?.company_name}
                planName={selectedInvoice?.plan_name}
                planInterval={selectedInvoice?.plan_interval}
            />

        </CustomerLayout>

    );

}

export default BillingHistory;