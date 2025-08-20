
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "", city: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/users");
    setUsers(res.data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/users", form);
    setForm({ name: "", email: "", password: "", country: "", city: "" });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/users/${id}`);
    fetchUsers();
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    await axios.put(`/api/admin/users/${id}`, { name: newName });
    fetchUsers();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">Add User</h2>
        <div className="grid grid-cols-2 gap-4">
          <input className="p-2 border" placeholder="Name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="p-2 border" placeholder="Email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="p-2 border" placeholder="Password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input className="p-2 border" placeholder="Country"
            value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <input className="p-2 border" placeholder="City"
            value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white py-2 px-4 rounded">
          Add User
        </button>
      </form>

      {/* Users Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">Users List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.country}</td>
                <td className="p-2 border">{u.city}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => handleUpdate(u._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(u._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
