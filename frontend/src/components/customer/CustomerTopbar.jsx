import { FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import "../../styles/customer/customer-topbar.css";

function CustomerTopbar() {

    const { user, loading } = useAuth();

    return (

        <header className="customer-topbar">

            <div className="search-box">

                <FaSearch />

                <input
                    placeholder="Search invoices, plans..."
                />

            </div>

            <div className="topbar-right">

                <button className="notification-btn">

                    <FaBell />

                    <span className="notification-dot"/>

                </button>

                {loading ? (

                    <div className="user-loading">

                        <div className="avatar-skeleton"/>

                        <div>

                            <div className="line-skeleton short"/>

                            <div className="line-skeleton tiny"/>

                        </div>

                    </div>

                ) : (

                    <div className="user-profile">

                        <div className="avatar">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                        <div className="user-info">

    <h4>{user?.name}</h4>

    <span>{user?.role}</span>

</div>
                    </div>

                )}

            </div>

        </header>

    );

}

export default CustomerTopbar;