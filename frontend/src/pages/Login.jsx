import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("admin@carryfast.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <h1>Carryfast Logistics</h1>
        <p className="sub">Vehicle Tracking & Operations Management System</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          <button className="btn" type="submit" style={{ width: "100%" }}>Sign in</button>
          {error && <p className="error-text">{error}</p>}
        </form>
        <p style={{ fontSize: 11, color: "#888", marginTop: 20 }}>
          Demo: admin@carryfast.com / Admin@123 (Admin) · operator@carryfast.com / Operator@123 (User)
        </p>
      </div>
    </div>
  );
}
