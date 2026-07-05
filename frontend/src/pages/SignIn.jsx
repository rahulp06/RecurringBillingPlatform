import "./../styles/neumorphism.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem(
        "token",
        data.access_token
      );

      navigate("/dashboard");

    } else {

      alert(data.detail);

    }

  } catch (error) {

    console.error(error);
    alert("Server Error");

  }
};
  return (
    <div className="container">
      <div className="card">
        <h1>Recurring Billing Platform</h1>
        <h1>Sign In</h1>

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

        <button onClick={handleLogin}>Sign In</button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;