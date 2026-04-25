import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "./UserManagement.css";

const ROLES = ["USER", "ADMIN", "TECHNICIAN"];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessId(userId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "ADMIN": return "role-badge admin";
      case "TECHNICIAN": return "role-badge technician";
      default: return "role-badge user";
    }
  };

  return (
    <AdminLayout activeMenu="users">
      <div className="admin-main-header">
        <div className="header-left">
          <div className="dashboard-badge">User Management</div>
          <h1>Role Management</h1>
          <p>View all users and manage their roles</p>
        </div>
      </div>

      {/* STATS */}
      <section className="summary-grid">
        <div className="summary-card soft-pink">
          <span>Total Users</span>
          <h3>{users.length}</h3>
        </div>
        <div className="summary-card soft-purple">
          <span>Admins</span>
          <h3>{users.filter((u) => u.role === "ADMIN").length}</h3>
        </div>
        <div className="summary-card soft-yellow">
          <span>Technicians</span>
          <h3>{users.filter((u) => u.role === "TECHNICIAN").length}</h3>
        </div>
        <div className="summary-card soft-green">
          <span>Regular Users</span>
          <h3>{users.filter((u) => u.role === "USER").length}</h3>
        </div>
      </section>

      {/* TABLE CARD */}
      <div className="um-card glass-card">

        {/* SEARCH */}
        <div className="um-toolbar">
          <input
            className="um-search"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="um-count">{filtered.length} users</span>
        </div>

        {loading && <p className="um-status">Loading users...</p>}
        {error && <p className="um-status error">{error}</p>}

        {!loading && !error && (
          <div className="um-table-wrapper">
            <table className="um-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Provider</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="um-empty">No users found</td>
                  </tr>
                ) : (
                  filtered.map((user, index) => (
                    <tr key={user.id} className={successId === user.id ? "row-success" : ""}>
                      <td className="um-index">{index + 1}</td>
                      <td className="um-name">
                        <div className="um-avatar">
                          {user.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span>{user.name || "—"}</span>
                      </td>
                      <td className="um-email">{user.email}</td>
                      <td>
                        <span className={`provider-badge ${user.provider?.toLowerCase() || "local"}`}>
                          {user.provider || "Local"}
                        </span>
                      </td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className="um-role-select"
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {updatingId === user.id && (
                          <span className="um-updating">Saving...</span>
                        )}
                        {successId === user.id && (
                          <span className="um-saved">✓ Saved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}