import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Configure axios defaults
axios.defaults.timeout = 10000;

// Add request/response interceptors for debugging
axios.interceptors.request.use(request => {
  console.log('🚀 Starting Request:', request.method?.toUpperCase(), request.url);
  console.log('📤 Request Data:', request.data);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ Request failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    return Promise.reject(error);
  }
);

// Signup – sends name, email, phone to get OTP
export const signup = async (data) => {
  try {
    console.log("🔥 Making signup request to:", `${API_URL}/signup`);
    console.log("📋 Request payload:", {
      name: data.name,
      email: data.email,
      phone: data.phone || ""
    });

    const res = await axios.post(`${API_URL}/signup`, {
      name: data.name,
      email: data.email,
      phone: data.phone || ""
    });
    
    console.log("🎉 Signup successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Signup service error:", error);
    console.error("💥 Error response data:", error.response?.data);
    console.error("💥 Error status:", error.response?.status);
    console.error("💥 Request URL:", error.config?.url);
    throw error;
  }
};

// Verify OTP – sends all user data including password
export const verifyOtp = async (data) => {
  try {
    console.log("🔐 Making verify OTP request to:", `${API_URL}/verify-otp`);
    
    const res = await axios.post(`${API_URL}/verify-otp`, {
      email: data.email,
      otp: data.otp,
      password: data.password,
      country: data.country || "",
      city: data.city || ""
    });
    
    console.log("🎉 OTP verification successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Verify OTP service error:", error);
    console.error("💥 Error response data:", error.response?.data);
    throw error;
  }
};

// Resend OTP
export const resendOtp = async (email) => {
  try {
    console.log("📨 Making resend OTP request to:", `${API_URL}/resend-otp`);
    
    const res = await axios.post(`${API_URL}/resend-otp`, { email });
    
    console.log("🎉 Resend OTP successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Resend OTP service error:", error);
    console.error("💥 Error response data:", error.response?.data);
    throw error;
  }
};

// Login – saves token and user data
export const login = async ({ email, password }) => {
  try {
    console.log("🔑 Making login request to:", `${API_URL}/login`);
    
    const res = await axios.post(`${API_URL}/login`, { email, password });
    
    // Store both token and user info
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Set default authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
    
    console.log("🎉 Login successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Login service error:", error);
    console.error("💥 Error response data:", error.response?.data);
    throw error;
  }
};

// Logout – clear all stored data
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  
  // Remove authorization header
  delete axios.defaults.headers.common['Authorization'];
};

// Get current user data only
export const getCurrentUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

// Get current token
export const getCurrentToken = () => {
  return localStorage.getItem("token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getCurrentToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Initialize axios with token if exists (call this on app startup)
export const initializeAuth = () => {
  const token = getCurrentToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};