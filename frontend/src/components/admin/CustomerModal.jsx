import { useEffect, useState } from "react";

function CustomerModal({

    open,

    onClose,

    onSave,

    editCustomer

}){

    const [errors,setErrors]=useState({});

    const [form,setForm]=useState({

        name:"",

        email:"",

        company_name:"",

        role:"customer",

        password:""

    });

    useEffect(()=>{

        if(editCustomer){

            setForm({

                ...editCustomer,

                password:""

            });

        }

        else{

            setForm({

                name:"",

                email:"",

                company_name:"",

                role:"customer",

                password:""

            });

        }

        setErrors({});

    },[editCustomer,open]);

    if(!open) return null;

    const handleSubmit=()=>{

        const newErrors={};

        if(!form.name.trim())

            newErrors.name="Name is required.";

        if(!form.email.trim())

            newErrors.email="Email is required.";

        if(!editCustomer && !form.password.trim())

            newErrors.password="Password is required.";

        setErrors(newErrors);

        if(Object.keys(newErrors).length>0) return;

        onSave(form);

    };

    return(

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {editCustomer ? "Edit Customer" : "Create Customer"}

                </h2>

                <div className="form-grid">

                    <div>

                        <label>Name</label>

                        <input

                            value={form.name}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    name:e.target.value

                                })

                            }

                        />

                        {errors.name &&

                            <span className="form-error">

                                {errors.name}

                            </span>

                        }

                    </div>

                    <div>

                        <label>Email</label>

                        <input

                            value={form.email}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    email:e.target.value

                                })

                            }

                        />

                        {errors.email &&

                            <span className="form-error">

                                {errors.email}

                            </span>

                        }

                    </div>

                    <div>

                        <label>Company</label>

                        <input

                            value={form.company_name}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    company_name:e.target.value

                                })

                            }

                        />

                    </div>

                    <div>

                        <label>Role</label>

                        <select

                            value={form.role}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    role:e.target.value

                                })

                            }

                        >

                            <option value="customer">

                                Customer

                            </option>

                            <option value="admin">

                                Admin

                            </option>

                        </select>

                    </div>

                </div>

                {

                    !editCustomer &&

                    <>

                        <label>Password</label>

                        <input

                            type="password"

                            value={form.password}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    password:e.target.value

                                })

                            }

                        />

                        {errors.password &&

                            <span className="form-error">

                                {errors.password}

                            </span>

                        }

                    </>

                }

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

                        Save Customer

                    </button>

                </div>

            </div>

        </div>

    );

}

export default CustomerModal;