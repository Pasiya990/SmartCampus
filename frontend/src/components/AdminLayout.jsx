import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminLayout.css";

export default function AdminLayout({ children, activeMenu = "dashboard" }) {
  const navigate = useNavigate();

  const getRole = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return "USER";
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const tokenRole = (payload.role || payload.authorities || "USER")
        .toString()
        .toUpperCase();
      return tokenRole;
    } catch (error) {
      console.error("Failed to decode token in AdminLayout:", error);
      return "USER";
    }
  };

  const role = getRole();
  const isAdmin =
    role === "ADMIN" ||
    role === "ROLE_ADMIN" ||
    role.includes("ADMIN");

  if (!isAdmin) {
    return <>{children}</>;
  }

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    toast.custom(
      (t) => (
        <div className="logout-toast">
          <div className="logout-toast-icon">⎋</div>
          <h3>Logout</h3>
          <p>Are you sure you want to log out from the admin panel?</p>

          <div className="logout-actions">
            <button
              className="btn-logout-confirm"
              onClick={() => {
                toast.dismiss(t.id);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
              }}
            >
              Yes, Logout
            </button>

            <button
              className="btn-logout-cancel"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
      }
    );
  };

  return (
    <div className="admin-layout-page">
      <aside className="admin-layout-sidebar">
        <div className="sidebar-glow sidebar-glow-top"></div>
        <div className="sidebar-glow sidebar-glow-bottom"></div>

        <div className="sidebar-top">
          <div className="sidebar-logo-card">
            <div className="sidebar-logo">
              <div className="logo-icon">📘</div>
              <div>
                <h2>Resora</h2>
                <p>Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="sidebar-section-label">Navigation</div>

          <div className="sidebar-menu">
            <button
              className={`admin-side-btn ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("/admin")}
            >
              
              <span>Dashboard</span>
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "tickets" ? "active" : ""}`}
              onClick={() => handleMenuClick("/tickets")}
            >
              
              <span>Tickets</span>
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "bookings" ? "active" : ""}`}
              onClick={() => handleMenuClick("/admin/bookings")}
            >
              
              <span>Bookings</span>
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "resources" ? "active" : ""}`}
              onClick={() => handleMenuClick("/resources")}
            >
              
              <span>Resources</span>
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "users" ? "active" : ""}`}
              onClick={() => handleMenuClick("/admin/users")}
            >
              <span>Role Management</span>
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            className="admin-side-btn logout-btn"
            onClick={handleLogout}
          >
            <span className="menu-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>

        <div className="sidebar-bottom-art"></div>
        <div className="sidebar-leaf leaf-1"></div>
        <div className="sidebar-leaf leaf-2"></div>
        <div className="sidebar-leaf leaf-3"></div>
        <div className="sidebar-leaf leaf-4"></div>
      </aside>

      <main className="admin-layout-main">{children}</main>
    </div>
  );
}