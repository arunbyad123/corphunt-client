import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signup = async (data) => {
  return await axios.post(`${API_URL}/signup`, data);
};

export const login = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  if (res.data.token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).user : null;
};
