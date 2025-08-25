import { useState } from "react";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent!");
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password reset successful! Login again.");
        window.location.href = "/login";
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("Failed to reset password");
    }
  };

  return (
    <div className="form-page">
      <main className="form-card">
        <h2>Forgot Password</h2>
        {error && <div className="error">{error}</div>}
        {!otpSent ? (
          <div>
            <label>Email or Phone</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <button onClick={sendOtp} className="btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div>
            <label>Enter OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} />
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={resetPassword} className="btn">
              Reset Password
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
