import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { signup, verifyOtp } from "../services/authService";
import "../styles/globals.css";

export default function Signup() {
  const nav = useNavigate();
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

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...payload } = form;

      const data = await signup({
        ...payload,
        email: payload.email.trim().toLowerCase(),
        password: payload.password.trim(),
        country: payload.country.trim(),
        city: payload.city.trim(),
        phone: payload.phone.trim(),
      });

      // IMPORTANT: data is already the response body
      if (data?.otpSent) {
        setOtpSent(true);
        alert("OTP sent to your email/phone!");
      } else {
        alert("Signup successful! Please login.");
        nav("/login");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async () => {
    setError("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      await verifyOtp({ email: form.email.trim().toLowerCase(), otp: otp.trim() });
      alert("Signup successful! Please login.");
      nav("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Invalid or expired OTP";
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
        <h2>Create Your corpHunt Account</h2>
        <p className="helper">Sign up to search & track IT companies.</p>

        {error && <div className="error">{error}</div>}

        {!otpSent ? (
          <form onSubmit={submit} className="form-grid">
            <div className="row">
              <div>
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => change("email", e.target.value)}
                  required
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
                  required
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  value={form.country}
                  onChange={(e) => change("country", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>City</label>
                <input
                  value={form.city}
                  onChange={(e) => change("city", e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => change("password", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => change("confirmPassword", e.target.value)}
                  required
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
            <div className="row">
              <div>
                <label>Enter OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={submitOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                className="link"
                type="button"
                onClick={() => setOtpSent(false)}
                disabled={loading}
              >
                Go back
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
