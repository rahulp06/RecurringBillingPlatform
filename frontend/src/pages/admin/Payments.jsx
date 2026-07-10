import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import PaymentModal from "../../components/admin/PaymentModal";

import {
    getPayments,
    getInvoices,
    getCustomers,
    getSubscriptions,
    getPlans,
    createPayment,
    updatePayment,
    deletePayment
} from "../../services/api";

function Payments() {

    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [editPayment, setEditPayment] = useState(null);

    useEffect(() => {

        loadPayments();

    }, []);

    const loadPayments = async () => {

        setLoading(true);

        try {

            const [

                paymentData,
                invoiceData,
                customerData,
                subscriptionData,
                planData

            ] = await Promise.all([

                getPayments(),
                getInvoices(),
                getCustomers(),
                getSubscriptions(),
                getPlans()

            ]);

            setInvoices(invoiceData);

            const customerMap = {};

            customerData.forEach(customer => {

                customerMap[customer.id] = customer.name;

            });

            const subscriptionMap = {};

            subscriptionData.forEach(subscription => {

                subscriptionMap[subscription.id] = subscription;

            });

            const invoiceMap = {};

            invoiceData.forEach(invoice => {

                const subscription =
                    subscriptionMap[invoice.subscription_id];

                invoiceMap[invoice.id] = {

                    invoiceNumber: invoice.invoice_number,

                    customer:

                        customerMap[invoice.customer_id],

                    subscription

                };

            });

            const formatted = paymentData.map(payment => ({

                id: payment.id,

                payment_reference:

                    payment.payment_reference,

                customer:

                    invoiceMap[payment.invoice_id]?.customer,

                invoice:

                    invoiceMap[payment.invoice_id]?.invoiceNumber,

                amount:

                    new Intl.NumberFormat(

                        "en-IN",

                        {

                            style: "currency",

                            currency: "INR"

                        }

                    ).format(payment.amount),

                payment_method:

    payment.payment_method
        .replace("_"," ")
        .replace(/\b\w/g,c=>c.toUpperCase()),

                status:

                    payment.status,

                invoice_id:

                    payment.invoice_id,

                payment_date:

                    payment.payment_date,

                amount_raw:

                    payment.amount

            }));

            setPayments(formatted);

        }

        finally {

            setLoading(false);

        }

    };

    const handleEdit = (payment) => {

        setEditPayment(payment);

        setOpenModal(true);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this payment?")) return;

        try {

            await deletePayment(id);

            toast.success("Payment deleted.");

            loadPayments();

        }

        catch {

            toast.error("Unable to delete payment.");

        }

    };

    const handleSave = async (form) => {

        try {

            if (editPayment) {

                await updatePayment(editPayment.id, form);

                toast.success("Payment updated.");

            }

            else {

                await createPayment(form);

                toast.success("Payment created.");

            }

            setOpenModal(false);

            loadPayments();

        }

        catch {

            toast.error("Operation failed.");

        }

    };

    return (

        <div className="layout">

            <Sidebar />

            <div className="main">

                <Topbar />

                <div className="dashboard">

                    <div className="page-header">

                        <div>

                            <h1>

                                Payments

                            </h1>

                            <p>

                                Track customer payments.

                            </p>

                        </div>

                        <button

                            className="primary-btn"

                            onClick={() => {

                                setEditPayment(null);

                                setOpenModal(true);

                            }}

                        >

                            + Record Payment

                        </button>

                    </div>

                    {

                        loading

                        ?

                        <Loading />

                        :

                        payments.length === 0

                        ?

                        <EmptyState

                            title="No Payments"

                            message="No payments found."

                        />

                        :

                        <DataTable

                            title="Payments"

                            subtitle="Monitor successful and pending customer payments."

                            columns={[

                                "Payment Reference",

                                "Customer",

                                "Invoice",

                                "Amount",

                                "Payment Method",

                                "Status",

                                "Actions"

                            ]}

                            data={payments}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                        />

                    }

                </div>

            </div>

            <PaymentModal

                open={openModal}

                editPayment={editPayment}

                invoices={invoices}

                onClose={() => setOpenModal(false)}

                onSave={handleSave}

            />

        </div>

    );

}

export default Payments;