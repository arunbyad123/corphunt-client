import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { login } from "../services/authService";
import "../styles/forms.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Hardcoded Admin Login (you can replace with backend check)
      if (email === "adminlogin@gmail.com" && password === "admin@9900") {
        localStorage.setItem("role", "admin"); // store role
        nav("/admin");
        return;
      }

      // Normal login flow
      await login({ email, password });
      localStorage.setItem("role", "user"); // store role
      nav("/");
    } catch (err) {
      console.log(err.response?.data);
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-page">
      <AnimatedBackground />
      <Navbar />
      <main className="form-card">
        <div className="login-message">
        <h2>Welcome back</h2>
        <p className="helper">Login with your email and password.</p>
        {error && <div className="error">{error}</div>}
        </div>
        <form onSubmit={submit} className="form-grid">
          <div className="row">
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">
              Login
            </button>
            <Link className="link" to="/signup">
              Create account
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
