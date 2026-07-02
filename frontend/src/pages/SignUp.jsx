import "./../styles/neumorphism.css";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function SignUp() {
  return (
    <div className="container">
      <div className="card">
        <h1>Recurring Billing Platform</h1>
        <h1>Sign Up</h1>

        <div className="inputBox">
          <FaUser />
          <input type="text" placeholder="Full Name" />
        </div>

        <div className="inputBox">
          <FaEnvelope />
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="inputBox">
          <FaLock />
          <input type="password" placeholder="Enter your password" />
        </div>

        <button>Create Account</button>

        <p>
          Already have an account?{" "}
          <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;