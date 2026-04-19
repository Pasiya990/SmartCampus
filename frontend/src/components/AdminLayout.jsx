import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout({ children, activeMenu = "dashboard" }) {
  const navigate = useNavigate();

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