import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/neumorphism.css";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) return;

  fetch("http://127.0.0.1:8000/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setUser(data);
    });

}, []);
const handleLogout = () => {

  localStorage.removeItem("token");

  setUser(null);

  navigate("/");

};
  return (
    <div className="container">
      <div className="card">
        <h1>Recurring Billing Platform</h1>

        <p style={{ marginBottom: "25px" }}>
          Manage subscriptions, invoices and payments efficiently.
        </p>

        {user ? (
  <>
    <h2>Welcome, {user.name}</h2>

    <p>{user.role}</p>

    <button onClick={handleLogout}>
      Logout
    </button>
  </>
) : (
  <>
    <Link to="/signin">
      <button style={{ marginBottom: "15px" }}>
        Sign In
      </button>
    </Link>

    <Link to="/signup">
      <button>Create Account</button>
    </Link>
  </>
)}
      </div>
    </div>
  );
}

export default Home;