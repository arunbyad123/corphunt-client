import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";  
import initThreeBackground from "./threeBackground";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "", city: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", country: "", city: "" });
  const [showEditModal, setShowEditModal] = useState(false);
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
      alert("Error fetching users. Please try again.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      alert("Name, email, and password are required");
      return;
    }

    try {
      await axios.post("/api/admin/users", form);
      setForm({ name: "", email: "", password: "", country: "", city: "" });
      fetchUsers();
      alert("User added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Error adding user. Please check if email already exists.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user. Please try again.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      country: user.country || "",
      city: user.city || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!editForm.name || !editForm.email) {
      alert("Name and email are required");
      return;
    }

    try {
      await axios.put(`/api/admin/users/${editingUser._id}`, editForm);
      setShowEditModal(false);
      setEditingUser(null);
      setEditForm({ name: "", email: "", country: "", city: "" });
      fetchUsers();
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user. Please check if email already exists.");
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({ name: "", email: "", country: "", city: "" });
  };

  const handleBackToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Three.js background */}
      <div id="three-bg"></div>

      {/* Admin Panel Header */}
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button className="admin-panel-btn back-login-btn" onClick={handleBackToLogin}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="user-form">
          <h2>Add User</h2>
          <div className="form-grid">
            <input 
              placeholder="Name *" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input 
              type="email"
              placeholder="Email *" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input 
              type="password" 
              placeholder="Password *" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
            <input 
              placeholder="Country" 
              value={form.country} 
              onChange={(e) => setForm({ ...form, country: e.target.value })} 
            />
            <input 
              placeholder="City" 
              value={form.city} 
              onChange={(e) => setForm({ ...form, city: e.target.value })} 
            />
          </div>
          <button type="submit" className="admin-panel-btn add-user-btn">
            Add User
          </button>
        </form>

        {/* Users Table */}
        <div className="users-table-container">
          <h2>Users List ({users.length} users)</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.country || "N/A"}</td>
                    <td>{user.city || "N/A"}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="admin-panel-btn edit-user-btn" 
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="admin-panel-btn delete-user-btn" 
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content edit-user-form">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="admin-panel-btn save-btn">
                  Save Changes
                </button>
                <button type="button" className="admin-panel-btn cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
