import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import InvoiceModal from "../../components/admin/InvoiceModal";

import {
    getInvoices,
    getCustomers,
    getSubscriptions,
    getPlans,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from "../../services/api";

function Invoices(){

    const [invoiceData,setInvoiceData]=useState([]);

    const [customers,setCustomers]=useState([]);

    const [subscriptions,setSubscriptions]=useState([]);

    const [plans,setPlans]=useState([]);

    const [loading,setLoading]=useState(true);

    const [openModal,setOpenModal]=useState(false);

    const [editInvoice,setEditInvoice]=useState(null);

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

                customerMap[customer.id]=customer.name;

            });

            const subscriptionMap={};

            subscriptions.forEach(subscription=>{

                subscriptionMap[subscription.id]=subscription;

            });

            const formatted=invoices.map(invoice=>({

                id:invoice.id,

                invoice:invoice.invoice_number,

                customer:customerMap[invoice.customer_id],

                amount:new Intl.NumberFormat(

    "en-IN",

    {

        style:"currency",

        currency:"INR"

    }

).format(invoice.total_amount),

                status:invoice.status,

                customer_id:invoice.customer_id,

                subscription_id:invoice.subscription_id,

                invoice_date:invoice.invoice_date,

                due_date:invoice.due_date,

                subtotal:invoice.subtotal,

                tax_amount:invoice.tax_amount,

                total_amount:invoice.total_amount

            }));

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

                    {

                        loading

                        ?

                        <Loading/>

                        :

                        invoiceData.length===0

                        ?

                        <EmptyState

                            title="No Invoices"

                            message="No invoices found."

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

                            data={invoiceData}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

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

        </div>

    );

}

export default Invoices;