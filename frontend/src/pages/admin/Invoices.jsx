import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import InvoiceModal from "../../components/admin/InvoiceModal";
import InvoiceDetailModal from "../../components/common/InvoiceDetailModal";

import {
    getInvoices,
    getCustomers,
    getSubscriptions,
    getPlans,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoices
} from "../../services/api";

function Invoices(){

    const [invoiceData,setInvoiceData]=useState([]);

    const [customers,setCustomers]=useState([]);

    const [subscriptions,setSubscriptions]=useState([]);

    const [plans,setPlans]=useState([]);

    const [loading,setLoading]=useState(true);

    const [openModal,setOpenModal]=useState(false);

    const [editInvoice,setEditInvoice]=useState(null);

    // Detail view state
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Generate Modal state
    const [generateModalOpen, setGenerateModalOpen] = useState(false);
    const [taxRateInput, setTaxRateInput] = useState("18.0");
    const [generating, setGenerating] = useState(false);

    useEffect(()=>{

        loadInvoices();

    },[]);

    const loadInvoices=async()=>{

        setLoading(true);

        try{

            const [

                invoices,
                customers,
                subscriptions,
                plans

            ]=await Promise.all([

                getInvoices(),
                getCustomers(),
                getSubscriptions(),
                getPlans()

            ]);

            setCustomers(customers);

            setSubscriptions(subscriptions);

            setPlans(plans);

            const customerMap={};

            customers.forEach(customer=>{

                customerMap[customer.id]=customer;

            });

            const subscriptionMap={};

            subscriptions.forEach(subscription=>{

                subscriptionMap[subscription.id]=subscription;

            });

            const planMap={};

            plans.forEach(plan=>{

                planMap[plan.id]=plan;

            });

            const formatted=invoices.map(invoice=>{
                const customer = customerMap[invoice.customer_id] || {};
                const subscription = subscriptionMap[invoice.subscription_id] || {};
                const plan = planMap[subscription.plan_id] || {};

                return {

                    id:invoice.id,

                    invoice:invoice.invoice_number,

                    customer:customer.name || "",
                    
                    customer_email:customer.email || "",
                    
                    customer_company:customer.company_name || "",
                    
                    plan_name:plan.name || "",
                    
                    plan_interval:plan.billing_interval || "",

                    amount: invoice.total_amount < 0
                        ? `${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Math.abs(invoice.total_amount))} (Credit)`
                        : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(invoice.total_amount),

                    status:invoice.status,

                    customer_id:invoice.customer_id,

                    subscription_id:invoice.subscription_id,

                    invoice_date:invoice.invoice_date,

                    due_date:invoice.due_date,

                    subtotal:invoice.subtotal,

                    tax_amount:invoice.tax_amount,

                    total_amount:invoice.total_amount

                };

            });

            setInvoiceData(formatted);

        }

        finally{

            setLoading(false);

        }

    };

    const handleEdit=(invoice)=>{

        setEditInvoice(invoice);

        setOpenModal(true);

    };

    const handleView=(invoice)=>{
        setSelectedInvoice(invoice);
        setDetailModalOpen(true);
    };

    const handleDelete=async(id)=>{

        if(!window.confirm("Delete this invoice?")) return;

        try{

            await deleteInvoice(id);

            toast.success("Invoice deleted.");

            loadInvoices();

        }

        catch{

            toast.error("Unable to delete invoice.");

        }

    };

    const handleSave=async(form)=>{

        try{

            if(editInvoice){

                await updateInvoice(editInvoice.id,form);

                toast.success("Invoice updated.");

            }

            else{

                await createInvoice(form);

                toast.success("Invoice created.");

            }

            setOpenModal(false);

            loadInvoices();

        }

        catch{

            toast.error("Operation failed.");

        }

    };

    const handleBulkGenerate = async () => {
        const rate = parseFloat(taxRateInput);
        if (isNaN(rate) || rate < 0 || rate > 100) {
            toast.error("Tax rate must be a valid number between 0 and 100.");
            return;
        }

        setGenerating(true);
        try {
            const result = await generateInvoices(rate);
            toast.success(`${result.length || 0} invoices successfully generated.`);
            setGenerateModalOpen(false);
            loadInvoices();
        } catch (error) {
            toast.error(error.message || "Failed to generate invoices.");
        } finally {
            setGenerating(false);
        }
    };

    // Client-side filtering of dynamic data
    const filteredInvoices = invoiceData.filter(invoice => {
        if (statusFilter !== "all" && invoice.status.toLowerCase() !== statusFilter.toLowerCase()) {
            return false;
        }
        if (startDate && invoice.invoice_date < startDate) {
            return false;
        }
        if (endDate && invoice.invoice_date > endDate) {
            return false;
        }
        return true;
    });

    return(

        <div className="layout">

            <Sidebar/>

            <div className="main">

                <Topbar/>

                <div className="dashboard">

                    <div className="page-header">

                        <div>

                            <h1>Invoices</h1>

                            <p>

                                Manage generated invoices.

                            </p>

                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="primary-btn"
                                onClick={() => setGenerateModalOpen(true)}
                                style={{ backgroundColor: "#10b981" }}
                            >
                                Generate Invoices
                            </button>
                            <button

                                className="primary-btn"

                                onClick={()=>{

                                    setEditInvoice(null);

                                    setOpenModal(true);

                                }}

                            >

                                + Create Invoice

                            </button>
                        </div>

                    </div>

                    {/* Filters Controls Panel */}
                    <div className="filters-section" style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        padding: "15px 20px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        flexWrap: "wrap"
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Start Date</label>
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

                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>End Date</label>
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

                        {(statusFilter !== "all" || startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setStatusFilter("all");
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                style={{
                                    marginTop: "20px",
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

                    {

                        loading

                        ?

                        <Loading/>

                        :

                        filteredInvoices.length===0

                        ?

                        <EmptyState

                            title="No Invoices"

                            message="No invoices match the specified criteria."

                        />

                        :

                        <DataTable

                           title="Customer Invoices"

                           subtitle="Track generated invoices and payment status."

                            columns={[

                                "Invoice",

                                "Customer",

                                "Amount",

                                "Status",

                                "Actions"

                            ]}

                            data={filteredInvoices}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                            onView={handleView}

                        />

                    }

                </div>

            </div>

            <InvoiceModal

                open={openModal}

                editInvoice={editInvoice}

                customers={customers}

                subscriptions={subscriptions}

                plans={plans}

                onClose={()=>setOpenModal(false)}

                onSave={handleSave}

            />

            <InvoiceDetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                invoice={selectedInvoice}
                customerName={selectedInvoice?.customer}
                customerEmail={selectedInvoice?.customer_email}
                customerCompany={selectedInvoice?.customer_company}
                planName={selectedInvoice?.plan_name}
                planInterval={selectedInvoice?.plan_interval}
            />

            {/* Generate Invoices Modal */}
            {generateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: "450px" }}>
                        <h2>Generate Billing Invoices</h2>
                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                            This will scan all active and trial subscriptions and automatically generate unpaid invoices for any uninvoiced billing cycles.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "25px" }}>
                            <label style={{ fontWeight: "600", color: "#475569", fontSize: "14px" }}>Tax Rate (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={taxRateInput}
                                onChange={(e) => setTaxRateInput(e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "16px",
                                    outline: "none"
                                }}
                            />
                        </div>
                        <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                className="cancel-btn"
                                onClick={() => setGenerateModalOpen(false)}
                                disabled={generating}
                            >
                                Cancel
                            </button>
                            <button
                                className="primary-btn"
                                onClick={handleBulkGenerate}
                                disabled={generating}
                                style={{ backgroundColor: "#10b981" }}
                            >
                                {generating ? "Generating..." : "Generate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

}

export default Invoices;