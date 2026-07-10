import { useEffect, useState } from "react";

function PaymentModal({

    open,
    onClose,
    onSave,
    editPayment,
    invoices

}) {

    const [form, setForm] = useState({

        invoice_id: "",

        payment_reference: `PAY-${Date.now()}`,

        amount: "",

        payment_method: "UPI",

        status: "paid",

        payment_date: new Date().toISOString().slice(0, 16),

        created_at: new Date().toISOString(),

        updated_at: new Date().toISOString()

    });

    useEffect(() => {

        if (editPayment) {

            setForm({

                invoice_id: editPayment.invoice_id,

                payment_reference: editPayment.payment_reference,

                amount: editPayment.amount_raw,

                payment_method: editPayment.payment_method,

                status: editPayment.status,

                payment_date: editPayment.payment_date.slice(0,16),

                created_at: new Date().toISOString(),

                updated_at: new Date().toISOString()

            });

        }

        else {

            setForm({

                invoice_id: "",

                payment_reference: `PAY-${Date.now()}`,

                amount: "",

                payment_method: "UPI",

                status: "paid",

                payment_date: new Date().toISOString().slice(0,16),

                created_at: new Date().toISOString(),

                updated_at: new Date().toISOString()

            });

        }

    }, [editPayment, open]);

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {

                        editPayment

                        ?

                        "Edit Payment"

                        :

                        "Record Payment"

                    }

                </h2>

                <div className="form-grid">

                    <div>

                        <label>

                            Invoice

                        </label>

                        <select

                            value={form.invoice_id}

                            onChange={(e)=>{

                                const invoiceId = Number(e.target.value);

                                const invoice = invoices.find(

                                    invoice=>invoice.id===invoiceId

                                );

                                setForm({

                                    ...form,

                                    invoice_id: invoiceId,

                                    amount: invoice?.total_amount || ""

                                });

                            }}

                        >

                            <option value="">

                                Select Invoice

                            </option>

                            {

                                invoices.map(invoice=>(

                                    <option

                                        key={invoice.id}

                                        value={invoice.id}

                                    >

                                        {invoice.invoice_number}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div>

                        <label>

                            Payment Reference

                        </label>

                        <input

                            value={form.payment_reference}
                            readOnly
                        />

          

                    </div>

                    <div>

                        <label>

                            Amount

                        </label>

                        <input

                            type="number"

                            value={form.amount}

                            readOnly

                        />

                    </div>

                    <div>

                        <label>

                            Payment Method

                        </label>

                        <select

                            value={form.payment_method}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    payment_method:e.target.value

                                })

                            }

                        >

                            <option value="UPI">

                                UPI

                            </option>

                            <option value="Card">

                               Credit Card

                            </option>

                            <option value="Card">

                               Debit Card

                            </option>
                            
                            <option value="Net Banking">

                                Net Banking

                            </option>

                            <option value="Cash">

                                Cash

                            </option>

                        </select>

                    </div>

                    <div>

                        <label>

                            Payment Date

                        </label>

                        <input

                            type="datetime-local"

                            value={form.payment_date}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    payment_date:e.target.value

                                })

                            }

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

                            <option value="paid">

                                Paid

                            </option>

                            <option value="pending">

                                Pending

                            </option>

                            <option value="failed">

                                Failed

                            </option>

                            <option value="refunded">

                                Refunded

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

                        Save Payment

                    </button>

                </div>

            </div>

        </div>

    );

}

export default PaymentModal;