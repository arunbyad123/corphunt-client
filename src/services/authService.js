import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Signup – returns plain data (e.g., { message, otpSent })
export const signup = async (data) => {
  const res = await axios.post(`${API_URL}/signup`, data);
  return res.data;
};

// Verify OTP – returns plain data
export const verifyOtp = async ({ email, otp }) => {
  const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
  return res.data;
};

// Login – saves whole payload (token + user)
export const login = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  if (res.data?.token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

// If you only need the user: getCurrentUser()?.user
// If you need the token too: getCurrentUser()?.token
export const getCurrentUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};
