import "./../styles/neumorphism.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function SignIn() {
  return (
    <div className="container">
      <div className="card">
        <h1>Recurring Billing Platform</h1>
        <h1>Sign In</h1>

        <div className="inputBox">
          <FaEnvelope />
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="inputBox">
          <FaLock />
          <input type="password" placeholder="Enter your password" />
        </div>

        <button>Sign In</button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;