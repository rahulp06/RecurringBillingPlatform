import CustomerSidebar from "../components/customer/CustomerSidebar";
import CustomerTopbar from "../components/customer/CustomerTopbar";

import "../styles/common/layout.css";

function CustomerLayout({ children }) {
    return (
        <div className="customer-layout">

            <CustomerSidebar />

            <div className="customer-main">

                <CustomerTopbar />

                <main className="customer-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default CustomerLayout;