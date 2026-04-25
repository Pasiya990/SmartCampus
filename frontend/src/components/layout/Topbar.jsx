import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NotificationBell from "../NotificationBell";
import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ Decode fresh from token every render
  let role = null;
  let email = "";
  let name = "User";

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      role  = decoded.role;
      email = decoded.email || decoded.sub || "";
      name  = decoded.name || decoded.given_name || email.split("@")[0] || "User";
    }
  } catch {}

  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (role !== "USER") return null;

  return (
    <header className="topbar">

      <Link to="/user" className="logo">Resora</Link>

      <nav className="nav-links">
        <Link to="/user" className={isActive("/user") ? "active" : ""}>Dashboard</Link>
        <Link to="/my-tickets" className={isActive("/my-tickets") ? "active" : ""}>My Tickets</Link>
        <Link to="/my-bookings" className={isActive("/my-bookings") ? "active" : ""}>My Bookings</Link>
        <Link to="/resources" className={isActive("/resources") ? "active" : ""}>Resources</Link>
      </nav>

      <div className="topbar-right">

        <input className="search" placeholder="Search tickets, bookings..." />

        <NotificationBell />

        <div className="avatar-wrapper" ref={dropdownRef}>
          <button
            className="avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {name.charAt(0).toUpperCase()}
          </button>

          {dropdownOpen && (
            <div className="avatar-dropdown">

              <div className="dropdown-user">
                <div className="dropdown-avatar-large">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-name">{name}</span>
                  <span className="dropdown-email">{email}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button className="dropdown-logout" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log out
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}