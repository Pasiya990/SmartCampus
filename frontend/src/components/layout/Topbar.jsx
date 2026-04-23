// components/layout/Topbar.jsx
import { Link, useLocation } from "react-router-dom";
import NotificationBell from "../NotificationBell";

export default function Topbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="topbar">

      {/* 🔷 LOGO */}
      <Link to="/user" className="logo">
        CampusCore
      </Link>

      {/* 🔗 NAVIGATION (REAL FEATURES) */}
      <nav className="nav-links">

        <Link
          to="/user"
          className={isActive("/user") ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/my-tickets"
          className={isActive("/my-tickets") ? "active" : ""}
        >
          My Tickets
        </Link>

        <Link
          to="/my-bookings"
          className={isActive("/my-bookings") ? "active" : ""}
        >
          My Bookings
        </Link>

        <Link
          to="/resources"
          className={isActive("/resources") ? "active" : ""}
        >
          Resources
        </Link>

      </nav>

      {/* ⚙️ RIGHT SIDE */}
      <div className="topbar-right">

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search tickets, bookings..."
        />

        {/* NOTIFICATIONS */}
        <NotificationBell />

        {/* PROFILE */}
        <div className="avatar">
          {localStorage.getItem("name")?.charAt(0) || "U"}
        </div>

      </div>

    </header>
  );
}