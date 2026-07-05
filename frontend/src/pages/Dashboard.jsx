import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/neumorphism.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    fetch("http://127.0.0.1:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch("http://127.0.0.1:8000/plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <div className="topbar">

        <h1>Recurring Billing Platform</h1>

        {user && (
          <div className="profile-container">

            <div
              className="profile"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaUserCircle
                size={55}
                color="#4f46e5"
              />
            </div>

            {showMenu && (

              <div className="profile-menu">

                <div className="menu-user">

                  <FaUserCircle
                    size={45}
                    color="#4f46e5"
                  />

                  <div>

                    <h3>{user.name}</h3>

                    <p>{user.role}</p>

                    <small>{user.email}</small>

                  </div>

                </div>

                <hr />

                <button onClick={() => setShowMenu(false)}>
                  👤 My Profile
                </button>

                <button onClick={() => setShowMenu(false)}>
                  📦 My Plans
                </button>

                <button onClick={() => setShowMenu(false)}>
                  ⚙️ Settings
                </button>

                <button
                  className="logout-menu"
                  onClick={logout}
                >
                  🚪 Logout
                </button>

              </div>

            )}

          </div>
        )}

      </div>

      {/* ================= WELCOME ================= */}

      <div className="welcome-card">

        <h2>
          Welcome back, {user?.name} 👋
        </h2>

        <p>
          Manage your subscriptions, invoices and recurring
          payments from one dashboard.
        </p>

      </div>

      {/* ================= PLANS ================= */}

      <h2 className="section-title">
        Available Plans
      </h2>

      <div className="plans-grid">

        {plans.map((plan) => (

          <div
            key={plan.id}
            className="plan-card"
          >

            <h2>{plan.name}</h2>

            <h1>₹{plan.price}</h1>

            <p>
              <strong>Billing:</strong> {plan.billing_interval}
            </p>

            <p>
              <strong>Trial:</strong>  {plan.trial_days} Days
            </p>

            <p>
              <strong>Features:</strong><br />  
              {plan.features}
            </p>

            <button>

              Subscribe →

            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;