// pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { signup, verifyOtp, resendOtp } from "../services/authService";
import "../styles/globals.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP step
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const change = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Step 1: Signup request (send OTP)
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      
      // Only send name, email, phone for OTP generation
      const response = await signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim()
      });

      if (response?.message?.includes("OTP sent") || response?.message?.includes("verify")) {
        setOtpSent(true);
        alert("OTP sent to your email. Please check your inbox.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const msg = err?.response?.data?.message || err?.message || "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Verification (complete registration)
  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      
      // Send all user data including password for final registration
      const response = await verifyOtp({
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        otp: otp.trim(),
      });

      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("OTP verification error:", err);
      const msg = err?.response?.data?.message || err?.message || "Invalid or expired OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      
      await resendOtp(form.email.trim().toLowerCase());
      alert("New OTP sent to your email.");
    } catch (err) {
      console.error("Resend OTP error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to resend OTP";
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
        <h2>Create Your CorpHunt Account</h2>
        <p className="helper">Sign up to search & track IT companies.</p>

        {error && <div className="error">{error}</div>}

        {!otpSent ? (
          <form onSubmit={submit} className="form-grid">
            <div className="row">
              <div>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => change("email", e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => change("phone", e.target.value)}
                  disabled={loading}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => change("country", e.target.value)}
                  disabled={loading}
                  placeholder="Enter your country"
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => change("city", e.target.value)}
                  disabled={loading}
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label>Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => change("password", e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter password (min 6 characters)"
                  minLength={6}
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => change("confirmPassword", e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
              <Link className="link" to="/login">
                I Already Have an Account
              </Link>
            </div>
          </form>
        ) : (
          <div className="form-grid">
            <div className="otp-section">
              <p>We've sent a 6-digit verification code to:</p>
              <strong>{form.email}</strong>
              <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
                Please check your email and enter the code below.
              </p>
            </div>

            <form onSubmit={submitOtp}>
              <div className="row">
                <div>
                  <label>Enter OTP *</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={loading}
                    style={{ textAlign: "center", fontSize: "18px", letterSpacing: "2px" }}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn" 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                
                <div className="otp-actions" style={{ marginTop: "15px" }}>
                  <button
                    type="button"
                    className="link"
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={{ marginRight: "15px" }}
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                    }}
                    disabled={loading}
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}