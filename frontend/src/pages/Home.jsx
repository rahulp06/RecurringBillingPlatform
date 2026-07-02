import { Link } from "react-router-dom";
import "../styles/neumorphism.css";

function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Recurring Billing Platform</h1>

        <p style={{ marginBottom: "25px" }}>
          Manage subscriptions, invoices and payments efficiently.
        </p>

        <Link to="/signin">
          <button style={{ marginBottom: "15px" }}>Sign In</button>
        </Link>

        <Link to="/signup">
          <button>Create Account</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;