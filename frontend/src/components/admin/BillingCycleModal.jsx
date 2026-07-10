import { useEffect, useState } from "react";

function BillingCycleModal({

    open,
    onClose,
    onSave,
    editCycle

}) {

    const [form, setForm] = useState({

        subscription_id: "",

        cycle_start_date: "",

        cycle_end_date: "",

        renewal_date: "",

        status: "pending"

    });

    useEffect(() => {

        if (editCycle) {

            setForm({

                subscription_id: editCycle.subscription_id,

                cycle_start_date: editCycle.start_date,

                cycle_end_date: editCycle.end_date,

                renewal_date: editCycle.renewal_date,

                status: editCycle.status

            });

        }

        else {

            setForm({

                subscription_id: "",

                cycle_start_date: "",

                cycle_end_date: "",

                renewal_date: "",

                status: "pending"

            });

        }

    }, [editCycle, open]);

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {editCycle ? "Edit Billing Cycle" : "Create Billing Cycle"}

                </h2>

                <div className="form-grid">

                    <div>

                        <label>Subscription ID</label>

                        <input

                            type="number"

                            value={form.subscription_id}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    subscription_id:Number(e.target.value)

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>Start Date</label>

                        <input

                            type="date"

                            value={form.cycle_start_date}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    cycle_start_date:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>End Date</label>

                        <input

                            type="date"

                            value={form.cycle_end_date}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    cycle_end_date:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>Renewal Date</label>

                        <input

                            type="date"

                            value={form.renewal_date}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    renewal_date:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>Status</label>

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

                            <option value="active">

                                Active

                            </option>

                            <option value="completed">

                                Completed

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

                        onClick={() => onSave(form)}

                    >

                        Save Billing Cycle

                    </button>

                </div>

            </div>

        </div>

    );

}

export default BillingCycleModal;