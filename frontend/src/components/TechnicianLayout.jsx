import { useNavigate } from "react-router-dom";
import "./TechnicianLayout.css";

export default function TechnicianLayout({ children, activeMenu = "dashboard" }) {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="technician-layout-page">
      <aside className="technician-layout-sidebar">
        <div className="technician-sidebar-top">
          <div className="technician-sidebar-logo">
            <div className="technician-logo-icon">🛠️</div>
            <div>
              <h2>Resora</h2>
              <p>Technician Panel</p>
            </div>
          </div>

          <div className="technician-sidebar-menu">
            <button
              className={`technician-side-btn ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("/technician")}
            >
              Dashboard
            </button>

            <button
              className={`technician-side-btn ${activeMenu === "mytickets" ? "active" : ""}`}
              onClick={() => handleMenuClick("/technician/my-tickets")}
            >
              My Tickets
            </button>
          </div>
        </div>

        <div className="technician-sidebar-bottom-art"></div>
        <div className="technician-sidebar-leaf technician-leaf-1"></div>
        <div className="technician-sidebar-leaf technician-leaf-2"></div>
        <div className="technician-sidebar-leaf technician-leaf-3"></div>
        <div className="technician-sidebar-leaf technician-leaf-4"></div>
      </aside>

      <main className="technician-layout-main">{children}</main>
    </div>
  );
}