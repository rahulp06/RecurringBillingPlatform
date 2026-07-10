import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Customers from "./pages/admin/Customers";
import Subscriptions from "./pages/admin/Subscriptions";
import BillingCycles from "./pages/admin/BillingCycles";
import Invoices from "./pages/admin/Invoices";
import Payments from "./pages/admin/Payments";
import AuditLogs from "./pages/admin/AuditLogs";
import AvailablePlans from "./pages/customer/AvailablePlans";
import MySubscription from "./pages/customer/MySubscription";
import BillingHistory from "./pages/customer/BillingHistory";
import Profile from "./pages/customer/Profile";
import Plans from "./pages/admin/Plans";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
          path="/admin/dashboard"
          element={<AdminDashboard />} />
      <Route
          path="/admin/plans"
          element={<Plans />}
      />
      <Route
          path="/admin/subscriptions"
          element={<Subscriptions />}
      />
      <Route
          path="/admin/billing-cycles"
          element={<BillingCycles />}
      />
      <Route
          path="/admin/invoices"
          element={<Invoices />}
      />
      <Route
          path="/admin/payments"
          element={<Payments />}
      />
      <Route
          path="/admin/audit-logs"
          element={<AuditLogs />}
      />
      <Route

          path="/admin/customers"
          element={<Customers />}
      />

      <Route

          path="/customer/dashboard"

          element={<CustomerDashboard/>}

      />
      
    <Route

          path="/customer/plans"

          element={<AvailablePlans/>}
    />
    <Route

          path="/customer/subscription"

          element={<MySubscription/>}
    />
    <Route

          path="/customer/billing-history"

          element={<BillingHistory/>}
    />
    <Route

          path="/customer/profile"

          element={<Profile/>}
    />

</Routes>
  );
}

export default App;