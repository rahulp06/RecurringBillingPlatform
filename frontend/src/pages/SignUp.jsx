import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";

import HeroImage from "../assets/hero-image.svg";
import { signup } from "../services/api";

function SignUp() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",
        email: "",
        company_name: "",
        password: "",
        confirmPassword: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleRegister = async () => {

        if (

            !form.name ||

            !form.email ||

            !form.company_name ||

            !form.password ||

            !form.confirmPassword

        ) {

            toast.error("Please fill all fields.");

            return;

        }

        if (form.password !== form.confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }

        try {

            const data = await signup({

                name: form.name,

                email: form.email,

                company_name: form.company_name,

                password: form.password

            });

            if (data.detail) {

                toast.error(data.detail);

                return;

            }

            toast.success("Account created successfully!");

            navigate("/signin");

        }

        catch (err) {

            console.error(err);

            toast.error("Server Error");

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-left">

                <img

                    src={HeroImage}

                    alt="Billing Illustration"

                    className="auth-image"

                />

                <h2>

                    Join BillingPro 🚀

                </h2>

                <p>

                    Start managing subscriptions,

                    invoices and customer payments

                    in minutes.

                </p>

            </div>

            <div className="auth-right">

                <div className="auth-card">

                    <h1>

                        Create Account

                    </h1>

                    <p>

                        Create your BillingPro account.

                    </p>

                    <div className="inputBox">

                        <FaUser />

                        <input

                            type="text"

                            name="name"

                            placeholder="Enter your name"

                            value={form.name}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="inputBox">

                        <FaBuilding />

                        <input

                            type="text"

                            name="company_name"

                            placeholder="Company Name"

                            value={form.company_name}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="inputBox">

                        <FaEnvelope />

                        <input

                            type="email"

                            name="email"

                            placeholder="Enter your email"

                            value={form.email}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="inputBox">

                        <FaLock />

                        <input

                            type="password"

                            name="password"

                            placeholder="Enter your password"

                            value={form.password}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="inputBox">

                        <FaLock />

                        <input

                            type="password"

                            name="confirmPassword"

                            placeholder="Confirm your password"

                            value={form.confirmPassword}

                            onChange={handleChange}

                        />

                    </div>

                    <button

                        className="primary-btn auth-btn"

                        onClick={handleRegister}

                    >

                        Create Account

                    </button>

                    <div className="auth-footer">

                        <span>

                            Already have an account?

                        </span>

                        <Link to="/signin">

                            Sign In

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default SignUp;