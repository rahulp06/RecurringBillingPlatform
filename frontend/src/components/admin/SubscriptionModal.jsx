import { useEffect, useState } from "react";

function SubscriptionModal({

    open,
    onClose,
    onSave,
    editSubscription,
    customers,
    plans

}) {

    const [form, setForm] = useState({

        customer_id: "",
        plan_id: ""

    });

    useEffect(() => {

        if (editSubscription) {

            setForm({

                customer_id: editSubscription.customer_id,
                plan_id: editSubscription.plan_id

            });

        }

        else {

            setForm({

                customer_id: "",
                plan_id: ""

            });

        }

    }, [editSubscription, open]);

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {editSubscription ? "Edit Subscription" : "Create Subscription"}

                </h2>

                <div className="form-grid">

                    <div>

                        <label>

                            Customer 

                        </label>

                        <select

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

                            Plan 

                        </label>

                        <select

    value={form.plan_id}

    onChange={(e)=>

        setForm({

            ...form,

            plan_id:Number(e.target.value)

        })

    }

>

    <option value="">

        Select Plan

    </option>

    {

        plans.map(plan=>(

            <option

                key={plan.id}

                value={plan.id}

            >

                {plan.name}

            </option>

        ))

    }

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

                        onClick={() => onSave(form)}

                    >

                        Save Subscription

                    </button>

                </div>

            </div>

        </div>

    );

}

export default SubscriptionModal;