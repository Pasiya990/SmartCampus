import { useEffect, useState, useRef } from "react";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  clearAllNotifications,
} from "../api/notificationApi";
import { updateNotificationPreference, getUser } from "../api/userApi";
import "./NotificationBell.css";
import { Trash2 } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const dropdownRef = useRef();

  const token = localStorage.getItem("token");

  let email = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.sub;
    } catch {}
  }

  // 🔥 Load notifications
  const loadNotifications = async () => {
    if (!email || !enabled) return;

    try {
      const data = await getNotifications(email);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  // 🔥 Load user preference
  useEffect(() => {
    const loadPreference = async () => {
      if (!email) return;

      try {
        const user = await getUser(email);
        setEnabled(user.notificationsEnabled);
      } catch (err) {
        console.error("Failed to load preference", err);
      }
    };

    loadPreference();
  }, [email]);

  // 🔥 Auto refresh (only if enabled)
  useEffect(() => {
    if (!enabled) return;

    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [email, enabled]);

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  // 🔥 Actions
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    loadNotifications();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
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

  const toggleNotifications = async () => {
    const newValue = !enabled;

    try {
      await updateNotificationPreference(email, newValue);
      setEnabled(newValue);

      if (!newValue) {
        setNotifications([]); // clear UI when disabled
      } else {
        loadNotifications();
      }
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleString();
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      
      {/* 🔔 Bell */}
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        🔔
        {enabled && unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* 📩 Dropdown */}
      {open && (
        <div className="notification-dropdown">

          {/* 🔥 Header */}
          <div className="notification-header">
            <h4 className="notification-title">Notifications</h4>

            <div className="notification-actions">
              <button onClick={toggleNotifications}>
                {enabled ? "🔔 Disable" : "🔕 Enable"}
              </button>

              {enabled && notifications.length > 0 && (
                <>
                  <button onClick={handleMarkAll}>Mark all</button>
                  <button onClick={handleClearAll}>Clear all</button>
                </>
              )}
            </div>
          </div>

          {/* 🔕 Disabled state */}
          {!enabled ? (
            <p className="notification-empty">
              Notifications are disabled
            </p>
          ) : notifications.length === 0 ? (
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