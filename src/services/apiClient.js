import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle 401 unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

// ===== services/authService.js (Updated to use apiClient) =====
import api from './apiClient';

// Signup – sends name, email, phone to get OTP
export const signup = async (data) => {
  try {
    const response = await api.post('/auth/signup', {
      name: data.name,
      email: data.email,
      phone: data.phone || ""
    });
    return response.data;
  } catch (error) {
    console.error("Signup service error:", error);
    throw error;
  }
};

// Verify OTP – sends all user data including password
export const verifyOtp = async (data) => {
  try {
    const response = await api.post('/auth/verify-otp', {
      email: data.email,
      otp: data.otp,
      password: data.password,
      country: data.country || "",
      city: data.city || ""
    });
    return response.data;
  } catch (error) {
    console.error("Verify OTP service error:", error);
    throw error;
  }
};

// Resend OTP
export const resendOtp = async (email) => {
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  } catch (error) {
    console.error("Resend OTP service error:", error);
    throw error;
  }
};

// Login – saves token and user data
export const login = async ({ email, password }) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Store authentication data
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

// Logout – clear all stored data
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
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
