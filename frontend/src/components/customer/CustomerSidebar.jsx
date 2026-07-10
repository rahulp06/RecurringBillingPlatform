import {
    FaTachometerAlt,
    FaBoxOpen,
    FaCreditCard,
    FaFileInvoiceDollar,
    FaUserCircle,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import "../../styles/customer/customer-sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    const menu = [
        {
            title: "Dashboard",
            path: "/customer/dashboard",
            icon: <FaTachometerAlt />,
        },
        {
            title: "Plans",
            path: "/customer/plans",
            icon: <FaBoxOpen />,
        },
        {
            title: "Subscription",
            path: "/customer/subscription",
            icon: <FaCreditCard />,
        },
        {
            title: "Billing",
            path: "/customer/billing-history",
            icon: <FaFileInvoiceDollar />,
        },
        {
            title: "Profile",
            path: "/customer/profile",
            icon: <FaUserCircle />,
        },
    ];

    return (
        <aside className="customer-sidebar">

            <div>

                <div className="brand">

                    <h1>
                        Billing<span>Pro</span>
                    </h1>

                    <p>Customer Portal</p>

                </div>

                <nav className="sidebar-nav">

                    {menu.map((item) => (

                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            {item.title}

                        </NavLink>

                    ))}

                </nav>

            </div>

            <div className="sidebar-bottom">

                <button className="settings-btn">

                    <FaCog />

                    Settings

                </button>

                <button
                    className="logout-btn"
                    onClick={logout}
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;