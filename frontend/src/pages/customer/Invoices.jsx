import { Navigate } from "react-router-dom";

function Invoices() {
    return <Navigate to="/customer/billing-history" replace />;
}

export default Invoices;