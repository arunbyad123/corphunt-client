import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";  
import initThreeBackground from "./threeBackground";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "", city: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    initThreeBackground();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/users", form);
      setForm({ name: "", email: "", password: "", country: "", city: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    try {
      await axios.put(`/api/admin/users/${id}`, { name: newName });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Three.js background */}
      <div id="three-bg"></div>

      {/* Admin Panel Header */}
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button className="admin-panel-btn back-login-btn" onClick={handleBackToLogin}>Back to Login</button>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="user-form">
          <h2>Add User</h2>
          <div className="form-grid">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <button type="submit" className="admin-panel-btn add-user-btn">Add User</button>
        </form>

        {/* Users Table */}
        <div className="users-table-container">
          <h2>Users List</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.country}</td>
                  <td>{u.city}</td>
                  <td>
                    <button className="admin-panel-btn edit-user-btn" onClick={() => handleUpdate(u._id)}>Edit</button>
                    <button className="admin-panel-btn delete-user-btn" onClick={() => handleDelete(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
