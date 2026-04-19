import { useNavigate } from "react-router-dom";
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
      const tokenRole = (payload.role || payload.authorities || "USER").toString().toUpperCase();
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

  return (
    <div className="admin-layout-page">
      <aside className="admin-layout-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-icon">📘</div>
            <div>
              <h2>Headstart</h2>
              <p>Admin Panel</p>
            </div>
          </div>

          <div className="sidebar-menu">
            <button
              className={`admin-side-btn ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("/admin")}
            >
              Dashboard
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "tickets" ? "active" : ""}`}
              onClick={() => handleMenuClick("/tickets")}
            >
              Tickets
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "bookings" ? "active" : ""}`}
              onClick={() => handleMenuClick("/admin/bookings")}
            >
              Bookings
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "resources" ? "active" : ""}`}
              onClick={() => handleMenuClick("/resources")}
            >
              Resources
            </button>
          </div>
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