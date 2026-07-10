import { useEffect, useState } from "react";

function AuditLogModal({

    open,
    onClose,
    onSave,
    editLog

}) {

    const [form, setForm] = useState({

        entity_type: "",

        entity_id: "",

        action: "",

        old_value: "",

        new_value: "",

        performed_by: "System",

        created_at: new Date().toISOString()

    });

    useEffect(() => {

        if (editLog) {

            setForm({

                entity_type: editLog.entity,

                entity_id: Number(
                    String(editLog.entity_id).replace("#", "")
                ),

                action: editLog.action,

                old_value: editLog.old_value,

                new_value: editLog.new_value,

                performed_by: editLog.performed_by,

                created_at: editLog.created_at

            });

        }

        else {

            setForm({

                entity_type: "",

                entity_id: "",

                action: "",

                old_value: "",

                new_value: "",

                performed_by: "System",

                created_at: new Date().toISOString()

            });

        }

    }, [editLog, open]);

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {

                        editLog

                        ?

                        "Edit Audit Log"

                        :

                        "Create Audit Log"

                    }

                </h2>

                <div className="form-grid">

                    <div>

                        <label>

                            Entity Type

                        </label>

                        <select
    value={form.entity_type}
    onChange={(e)=>
        setForm({
            ...form,
            entity_type:e.target.value
        })
    }
>

    <option value="">Select Entity</option>
    <option value="plan">Plan</option>
    <option value="customer">Customer</option>
    <option value="subscription">Subscription</option>
    <option value="invoice">Invoice</option>
    <option value="payment">Payment</option>

</select>

                    </div>

                    <div>

                        <label>

                            Entity ID

                        </label>

                        <input

                            type="number"

                            value={form.entity_id}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    entity_id:Number(e.target.value)

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>

                            Action

                        </label>

                        <select
    value={form.action}
    onChange={(e)=>
        setForm({
            ...form,
            action:e.target.value
        })
    }
>

    <option value="">Select Action</option>
    <option value="Created">Created</option>
    <option value="Updated">Updated</option>
    <option value="Deleted">Deleted</option>

</select>

                    </div>

                    <div>

                        <label>

                            Performed By

                        </label>

                        <input

                            value={form.performed_by}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    performed_by:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>

                            Old Value

                        </label>

                        <textarea

                            rows="4"

                            value={form.old_value}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    old_value:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>

                            New Value

                        </label>

                        <textarea

                            rows="4"

                            value={form.new_value}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    new_value:e.target.value

                                })

                            }

                        />

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

                        Save Log

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AuditLogModal;