import { FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import "../../styles/admin/admin-topbar.css";

function AdminTopbar() {

    const { user, loading } = useAuth();

    return (

        <header className="topbar">

            <div className="topbar-left">

                <div className="search-box">

                    <FaSearch />

                    <input
                        placeholder="Search customers, invoices..."
                    />

                </div>

            </div>

            <div className="topbar-right">

                <button className="icon-btn">

                    <FaBell />

                    <span className="notification-dot"></span>

                </button>

                {loading ? (

                    <div className="user-loading">

                        <div className="avatar-skeleton"></div>

                        <div>

                            <div className="line-skeleton short"></div>

                            <div className="line-skeleton tiny"></div>

                        </div>

                    </div>

                ) : (

                    <div className="profile">

                        <div className="avatar">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                        <div className="profile-info">

                            <h4>{user?.name}</h4>

                            <p>
                                {user?.role === "admin"
                                    ? "Administrator"
                                    : user?.role}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </header>

    );

}

export default AdminTopbar;