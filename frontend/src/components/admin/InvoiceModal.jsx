import { useEffect, useState } from "react";

function InvoiceModal({

    open,
    onClose,
    onSave,
    editInvoice,
    customers,
    subscriptions,
    plans

}) {

    const [form,setForm]=useState({

        invoice_number:`INV-${Date.now()}`,

        customer_id:"",

        subscription_id:"",

        invoice_date:"",

        due_date:"",

        subtotal:"",

        tax_amount:"",

        total_amount:"",

        status:"active"

    });

    useEffect(()=>{

        if(editInvoice){

            setForm({

                invoice_number:editInvoice.invoice,

                customer_id:editInvoice.customer_id,

                subscription_id:editInvoice.subscription_id,

                invoice_date:editInvoice.invoice_date,

                due_date:editInvoice.due_date,

                subtotal:editInvoice.subtotal,

                tax_amount:editInvoice.tax_amount,

                total_amount:editInvoice.total_amount,

                status:editInvoice.status

            });

        }

        else{

            setForm({

                invoice_number:`INV-${Date.now()}`,

                customer_id:"",

                subscription_id:"",

                invoice_date:"",

                due_date:"",

                subtotal:"",

                tax_amount:"",

                total_amount:"",

                status:"active"

            });

        }

    },[editInvoice,open]);

    if(!open) return null;

    return(

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {

                        editInvoice

                        ?

                        "Edit Invoice"

                        :

                        "Create Invoice"

                    }

                </h2>

                <div className="form-grid">

                    <div>

                        <label>

                            Invoice Number

                        </label>

                        <input

                            value={form.invoice_number}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    invoice_number:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>

                            Customer

                        </label>

                        <select
                            disabled={form.subscription_id!==""}

                            value={form.customer_id}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    customer_id:Number(e.target.value)

                                })

                            }

                        >

                            <option value="">

                                Select Customer

                            </option>

                            {

                                customers.map(customer=>(

                                    <option

                                        key={customer.id}

                                        value={customer.id}

                                    >

                                        {customer.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div>

                        <label>

                            Subscription

                        </label>

                        <select

                            value={form.subscription_id}

                           onChange={(e)=>{

    const subscriptionId = Number(e.target.value);

    const subscription = subscriptions.find(

        subscription => subscription.id === subscriptionId

    );

    setForm({

        ...form,

        subscription_id: subscriptionId,

        customer_id: subscription.customer_id

    });

}}
                        >

                            <option value="">

                                Select Subscription

                            </option>

                            {

    subscriptions.map(subscription=>{

    const customer=

        customers.find(

            customer=>customer.id===subscription.customer_id

        );

    const plan=

        plans.find(

            plan=>plan.id===subscription.plan_id

        );

    return(

        <option

            key={subscription.id}

            value={subscription.id}

        >

            {customer?.name} • {plan?.name}

        </option>

    );

})

}

                        </select>

                    </div>

                    <div>

                        <label>

                            Invoice Date

                        </label>

                        <input

    type="date"

    value={form.invoice_date}

    onChange={(e)=>

        setForm({

            ...form,

            invoice_date:e.target.value

        })

    }

/>

                    </div>

                    <div>

                        <label>

                            Due Date

                        </label>

                        <input

                            type="date"

                            value={form.due_date}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    due_date:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>

                            Subtotal

                        </label>

<input

    type="number"

    value={form.subtotal}

    onChange={(e) => {
    const subtotal = Number(e.target.value || 0);
    const gstRate = Number(form.tax_amount || 0);

    const gstAmount = subtotal * gstRate / 100;

    setForm({
        ...form,
        subtotal,
        total_amount: Number((subtotal + gstAmount).toFixed(2))
    });
}}

/>

                    </div>

                    <div>

                        <label>

                            GST Rate (%)

                        </label>

                        <input

    type="number"

    value={form.tax_amount}

    onChange={(e) => {
    const gstRate = Number(e.target.value || 0);
    const subtotal = Number(form.subtotal || 0);

    const gstAmount = subtotal * gstRate / 100;

    setForm({
        ...form,
        tax_amount: gstRate,
        total_amount: Number((subtotal + gstAmount).toFixed(2))
    });
}}

/>

                    </div>

                    <div>

                        <label>

                            Total

                        </label>

                        <input

    type="number"

    value={form.total_amount}

    readOnly

/>

                    </div>

                    <div>

                        <label>

                            Status

                        </label>

                        <select

                            value={form.status}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    status:e.target.value

                                })

                            }

                        >

                            <option value="pending">

    Pending

</option>

<option value="paid">

    Paid

</option>

<option value="failed">

    Failed

</option>

<option value="cancelled">

    Cancelled

</option>

                        </select>

                    </div>

                </div>

                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="primary-btn"

                        onClick={()=>onSave(form)}

                    >

                        Save Invoice

                    </button>

                </div>

            </div>

        </div>

    );

}

export default InvoiceModal;