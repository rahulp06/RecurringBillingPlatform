import { useEffect, useState } from "react";

function PlanModal({

    open,

    onClose,

    onSave,

    editPlan

}) {

    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({

        name: "",

        price: "",

        billing_interval: "Monthly",

        trial_days: 14,

        features: "",

        status: "Active"

    });

    useEffect(() => {

        if (editPlan) {

            setForm(editPlan);

        } else {

            setForm({

                name: "",

                price: "",

                billing_interval: "Monthly",

                trial_days: 14,

                features: "",

                status: "Active"

            });

        }

        setErrors({});

    }, [editPlan, open]);

    if (!open) return null;

    const handleSubmit = () => {

        const newErrors = {};

        if (!form.name.trim()) {

            newErrors.name = "Plan name is required.";

        }

        if (!form.price || Number(form.price) <= 0) {

            newErrors.price = "Enter a valid price.";

        }

        if (!form.billing_interval) {

            newErrors.billing_interval = "Select billing interval.";

        }

        if (Number(form.trial_days) < 0) {

            newErrors.trial_days = "Trial days cannot be negative.";

        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        onSave(form);

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {editPlan ? "Edit Plan" : "Create Plan"}

                </h2>

                <div className="form-grid">

                    <div>

                        <label>Plan Name</label>

                        <input

                            value={form.name}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    name:e.target.value

                                })

                            }

                        />

                        {

                            errors.name &&

                            <span className="form-error">

                                {errors.name}

                            </span>

                        }

                    </div>

                    <div>

                        <label>Price</label>

                        <input

                            type="number"

                            value={form.price}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    price:e.target.value

                                })

                            }

                        />

                        {

                            errors.price &&

                            <span className="form-error">

                                {errors.price}

                            </span>

                        }

                    </div>

                    <div>

                        <label>Billing Interval</label>

                        <select

                            value={form.billing_interval}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    billing_interval:e.target.value

                                })

                            }

                        >

                            <option>Monthly</option>

                            <option>Annual</option>

                        </select>

                        {

                            errors.billing_interval &&

                            <span className="form-error">

                                {errors.billing_interval}

                            </span>

                        }

                    </div>

                    <div>

                        <label>Trial Days</label>

                        <input

                            type="number"

                            value={form.trial_days}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    trial_days:e.target.value

                                })

                            }

                        />

                        {

                            errors.trial_days &&

                            <span className="form-error">

                                {errors.trial_days}

                            </span>

                        }

                    </div>

                </div>

                <label>Features</label>

                <textarea

                    rows="5"

                    value={form.features}

                    onChange={(e)=>

                        setForm({

                            ...form,

                            features:e.target.value

                        })

                    }

                />

                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="primary-btn"

                        onClick={handleSubmit}

                    >

                        Save Plan

                    </button>

                </div>

            </div>

        </div>

    );

}

export default PlanModal;