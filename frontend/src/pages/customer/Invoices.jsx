import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/customer/CustomerSidebar";
import Topbar from "../../components/customer/CustomerTopbar";
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

    const [invoices,setInvoices]=useState([]);
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

                invoiceData,
                customerData,
                subscriptionData,
                planData

            ] = await Promise.all([

                getInvoices(),
                getCustomers(),
                getSubscriptions(),
                getPlans()

            ]);

            setCustomers(customerData);
            setSubscriptions(subscriptionData);
            setPlans(planData);

            const customerMap={};

            customerData.forEach(customer=>{

                customerMap[customer.id]=customer.name;

            });

            const planMap={};

            planData.forEach(plan=>{

                planMap[plan.id]=plan.name;

            });

            const subscriptionMap={};

            subscriptionData.forEach(subscription=>{

                subscriptionMap[subscription.id]=subscription.plan_id;

            });

            const formatted = invoiceData.map(invoice=>({

                id:invoice.id,

                invoice:invoice.invoice_number,

                customer:customerMap[invoice.customer_id],

                plan:planMap[
                    subscriptionMap[invoice.subscription_id]
                ],

                total:`₹${invoice.total_amount}`,

                due_date:invoice.due_date,

                status:invoice.status,

                subscription_id:invoice.subscription_id,

                customer_id:invoice.customer_id,

                invoice_date:invoice.invoice_date,

                subtotal:invoice.subtotal,

                tax_amount:invoice.tax_amount,

                total_amount:invoice.total_amount

            }));

            setInvoices(formatted);

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

            toast.error("Unable to delete.");

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

                            <h1>

                                Invoices

                            </h1>

                            <p>

                                Manage customer invoices.

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

                        invoices.length===0

                        ?

                        <EmptyState

                            title="No Invoices"

                            message="No invoices found."

                        />

                        :

                        <DataTable

                            title="Invoices"

                            subtitle="Customer invoices"

                            columns={[

                                "Invoice",

                                "Customer",

                                "Plan",

                                "Total",

                                "Due Date",

                                "Status",

                                "Actions"

                            ]}

                            data={invoices}

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