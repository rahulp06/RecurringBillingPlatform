import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroImage from "../assets/hero-image.svg";
import {
    FaCube,
    FaFileInvoice,
    FaCreditCard,
    FaChartLine
} from "react-icons/fa";

import "../styles/auth/auth.css";

function Home() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        fetch("http://127.0.0.1:8000/me", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        })

        .then(res => res.json())

        .then(data => setUser(data));

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");

        setUser(null);

        navigate("/");

    };

    return (

        <>

            <nav className="auth-navbar">

                <div className="logo">

                    BillingPro

                </div>

                <div className="nav-links">

                    {

                        user

                        ?

                        <button

                            className="primary-btn"

                            onClick={handleLogout}

                        >

                            Logout

                        </button>

                        :

                        <>

                            <Link to="/signin">

                                <button className="secondary-btn">

                                    Sign In

                                </button>

                            </Link>

                            <Link to="/signup">

                                <button className="primary-btn">

                                    Get Started

                                </button>

                            </Link>

                        </>

                    }

                </div>

            </nav>

            <section className="hero">

                <div>

                    <h1>

    Recurring Billing

    <br />

    Made Simple.

</h1>

                    <p>

    Everything you need to manage subscriptions,

    generate invoices,

    accept payments,

    and grow your SaaS business—

    all from one modern dashboard.

</p>

                    <div className="hero-buttons">

                        {

                            user

                            ?

                            <button

                                className="primary-btn"

                                onClick={()=>{

                                    navigate(

                                        user.role==="admin"

                                        ?

                                        "/admin/dashboard"

                                        :

                                        "/customer/dashboard"

                                    );

                                }}

                            >

                                Open Dashboard

                            </button>

                            :

                            <>

                                <Link to="/signup">

                                    <button className="primary-btn">

                                        Create Account

                                    </button>

                                </Link>

                                <Link to="/signin">

                                    <button className="secondary-btn">

                                        Sign In

                                    </button>

                                </Link>

                            </>

                        }

                    </div>
                    <div className="hero-stats">

    <div>

        <h3>500+</h3>

        <span>Businesses</span>

    </div>

    <div>

        <h3>12K+</h3>

        <span>Invoices</span>

    </div>

    <div>

        <h3>99.9%</h3>

        <span>Uptime</span>

    </div>

</div>

                </div>

                <div>

                    <img
    src={HeroImage}
    alt="Billing Dashboard"
    className="hero-image"
/>

                </div>

            </section>

            <section className="features">

                <div className="feature-card">

                    <div className="feature-icon">

                        <FaCube/>

                    </div>

                    <h3>

                        Smart Plans

                    </h3>

                    <p>

                        Create monthly and annual plans

                        with free trials and lifecycle management.

                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">

                        <FaFileInvoice/>

                    </div>

                    <h3>

                        Automatic Invoices

                    </h3>

                    <p>

                        Automatically generate invoices

                        and track billing history.

                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">

                        <FaCreditCard/>

                    </div>

                    <h3>

                        Secure Payments

                    </h3>

                    <p>

                        Monitor customer payments

                        and payment status in real time.

                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">

                        <FaChartLine/>

                    </div>

                    <h3>

                        Business Insights

                    </h3>

                    <p>

                        View KPIs,

                        revenue trends,

                        customer activity,

                        and business insights.

                    </p>

                </div>

            </section>
            <footer className="footer">

    <div>

        <h2>

            BillingPro

        </h2>

        <p>

            Modern recurring billing platform.

        </p>

    </div>

    <div>

        <h4>

            Product

        </h4>

        <p>Subscriptions</p>

        <p>Invoices</p>

        <p>Payments</p>

    </div>

    <div>

        <h4>

            Company

        </h4>

        <p>About</p>

        <p>Support</p>

        <p>Contact</p>

    </div>

</footer>

        </>

    );

}

export default Home;