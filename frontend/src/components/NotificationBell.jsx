import { useEffect, useState, useRef } from "react";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  clearAllNotifications,
} from "../api/notificationApi";
import "./NotificationBell.css";
import { Trash2 } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const token = localStorage.getItem("token");

  let email = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.sub;
    } catch {}
  }

  const loadNotifications = async () => {
    if (!email) return;
    try {
      const data = await getNotifications(email);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [email]);

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    loadNotifications();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // 🔥 prevent markAsRead
    await deleteNotification(id);
    loadNotifications();
  };

  const handleMarkAll = async () => {
    await markAllAsRead(email);
    loadNotifications();
  };

  const handleClearAll = async () => {
    await clearAllNotifications(email);
    loadNotifications();
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleString();
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      
      {/* 🔔 Bell */}
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* 📩 Dropdown */}
      {open && (
        <div className="notification-dropdown">
          
          <div className="notification-header">
            <h4 className="notification-title">Notifications</h4>

            {notifications.length > 0 && (
              <div className="notification-actions">
                <button onClick={handleMarkAll}>Mark all</button>
                <button onClick={handleClearAll}>Clear all</button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="notification-empty">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${
                  !n.readStatus ? "unread" : ""
                }`}
                onClick={() => handleMarkAsRead(n.id)}
              >
                <div className="notification-content">
                  <p className="notification-message">{n.message}</p>
                  <small className="notification-time">
                    {formatTime(n.createdAt)}
                  </small>
                </div>

                <button
                  className="notification-delete-btn"
                  onClick={(e) => handleDelete(e, n.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}