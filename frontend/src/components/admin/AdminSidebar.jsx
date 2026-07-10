import {
    FaChartLine,
    FaBoxOpen,
    FaUsers,
    FaLayerGroup,
    FaMoneyCheckAlt,
    FaFileInvoiceDollar,
    FaClipboardList,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import "../../styles/admin/admin-sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/signin");

    };

    return (

        <aside className="sidebar">

            <div className="sidebar-top">

                <div className="logo">

                    <h1>

                        Billing<span>Pro</span>

                    </h1>

                    <p>

                        Recurring Billing Platform

                    </p>

                </div>

                <div className="sidebar-section">

                    <div className="sidebar-title">

                        Main

                    </div>

                    <div className="sidebar-menu">

                        <NavLink
                            to="/admin/dashboard"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaChartLine/>

                            Dashboard

                        </NavLink>

                    </div>

                </div>

                <div className="sidebar-section">

                    <div className="sidebar-title">

                        Management

                    </div>

                    <div className="sidebar-menu">

                        <NavLink
                            to="/admin/plans"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaBoxOpen/>

                            Plans

                        </NavLink>

                        <NavLink
                            to="/admin/customers"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaUsers/>

                            Customers

                        </NavLink>

                        <NavLink
                            to="/admin/subscriptions"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaLayerGroup/>

                            Subscriptions

                        </NavLink>

                        <NavLink
                            to="/admin/billing-cycles"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaMoneyCheckAlt/>

                            Billing Cycles

                        </NavLink>

                    </div>

                </div>

                <div className="sidebar-section">

                    <div className="sidebar-title">

                        Finance

                    </div>

                    <div className="sidebar-menu">

                        <NavLink
                            to="/admin/invoices"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaFileInvoiceDollar/>

                            Invoices

                        </NavLink>

                        <NavLink
                            to="/admin/payments"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaMoneyCheckAlt/>

                            Payments

                        </NavLink>

                    </div>

                </div>

                <div className="sidebar-section">

                    <div className="sidebar-title">

                        System

                    </div>

                    <div className="sidebar-menu">

                        <NavLink
                            to="/admin/audit-logs"
                            className={({isActive})=>isActive?"sidebar-link active":"sidebar-link"}
                        >

                            <FaClipboardList/>

                            Audit Logs

                        </NavLink>

                    </div>

                </div>

            </div>

            <div className="sidebar-bottom">

                <button className="sidebar-btn">

                    <FaCog/>

                    Settings

                </button>

                <button
                    className="sidebar-btn logout-btn"
                    onClick={logout}
                >

                    <FaSignOutAlt/>

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;