import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import HeroImage from "../assets/hero-image.svg";
import { login, getMe } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
function SignIn() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formData = new URLSearchParams();
  
  formData.append("username", email);
  formData.append("password", password);
  const handleLogin = async () => {

    try {

        const data = await login(

            email,

            password

        );

        if (data.detail) {

            toast.error(data.detail);

            return;

        }

        const user = await getMe();

        setUser(user);

        toast.success("Login Successful!");

        if (user.role === "admin") {

            navigate("/admin/dashboard");

        }

        else {

            navigate("/customer/dashboard");

        }

    }

    catch (err) {

        console.error(err);

        toast.error("Server Error");

    }

};
  return (
    <div className="auth-page">

    <div className="auth-left">

        <img
            src={HeroImage}
            alt="Billing Illustration"
            className="auth-image"
        />

        <h2>

            Welcome Back 👋

        </h2>

        <p>

            Continue managing subscriptions,

            invoices and customer payments

            from your BillingPro dashboard.

        </p>

    </div>

    <div className="auth-right">

        <div className="auth-card">

            <h1>

                Sign In

            </h1>

            <p>

                Sign in to continue managing subscriptions,
payments and invoices.

            </p>

        <div className="inputBox">
          <FaEnvelope />
          <input
           type="email"
           placeholder="Enter your email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className="inputBox">
          <FaLock />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
            className="primary-btn auth-btn"
            onClick={handleLogin}
        >

            Sign In

        </button>

         <div className="auth-footer">
          <span>

                Don't have an account?
          </span>

                <Link to="/signup">

                    Create Account

                </Link>
                </div>
      </div>
      </div>
    </div>
  );
}

export default SignIn;