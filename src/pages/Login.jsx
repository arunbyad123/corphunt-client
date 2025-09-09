// pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { login } from "../services/authService";
import "../styles/forms.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      // Check for hardcoded admin login
      if (email.toLowerCase().trim() === "adminlogin@gmail.com" && password === "admin@9900") {
        localStorage.setItem("role", "admin");
        localStorage.setItem("user", JSON.stringify({ 
          email: email.trim(),
          name: "Admin",
          role: "admin" 
        }));
        alert("Admin login successful!");
        navigate("/admin");
        return;
      }

      // Normal user login
      const response = await login({ 
        email: email.trim().toLowerCase(), 
        password: password.trim() 
      });

      if (response?.token && response?.user) {
        localStorage.setItem("role", "user");
        alert("Login successful!");
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
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
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label>Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
              <Link to="/forgetpassword" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
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