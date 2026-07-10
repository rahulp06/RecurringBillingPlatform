import CustomerLayout from "../../layouts/CustomerLayout";
import { useAuth } from "../../context/AuthContext";

import "../../styles/customer/customer-profile.css";

function Profile() {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <CustomerLayout>
                <div className="customer-profile">
                    <h2>Loading profile...</h2>
                </div>
            </CustomerLayout>
        );
    }

    return (

        <CustomerLayout>

            <div className="customer-profile">

                <div className="profile-header">

                    <div>

                        <div className="profile-avatar">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                    </div>

                    <div>

                        <h1>{user?.name}</h1>

                        <p>{user?.email}</p>

                        <span className="role-badge">

                            {user?.role === "admin"
                                ? "Administrator"
                                : "Customer"}

                        </span>

                    </div>

                </div>

                <div className="profile-card">

                    <h2>Account Information</h2>

                    <div className="profile-grid">

                        <div className="profile-item">

                            <label>Full Name</label>

                            <input
                                value={user?.name || ""}
                                readOnly
                            />

                        </div>

                        <div className="profile-item">

                            <label>Email Address</label>

                            <input
                                value={user?.email || ""}
                                readOnly
                            />

                        </div>

                        <div className="profile-item">

                            <label>Company</label>

                            <input
                                value={user?.company_name || "-"}
                                readOnly
                            />

                        </div>

                        <div className="profile-item">

                            <label>Role</label>

                            <input
                                value={user?.role}
                                readOnly
                            />

                        </div>

                    </div>

                </div>

            </div>

        </CustomerLayout>

    );

}

export default Profile;