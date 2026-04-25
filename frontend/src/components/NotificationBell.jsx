import { useEffect, useState, useRef, useCallback } from "react";import {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  clearAllNotifications,
} from "../api/notificationApi";
import { updateNotificationPreference, getUser } from "../api/userApi";
import "./NotificationBell.css";
import { Trash2, Bell, BellOff } from "lucide-react";
import { connectSocket, disconnectSocket } from "../services/socket";

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

  const loadNotifications = useCallback(async () => {
    if (!email || !enabled) return;
    try {
      const data = await getNotifications(email);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }, [email, enabled]);

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

  useEffect(() => {
    if (!email || !enabled) return;
    loadNotifications();
    connectSocket(email, (newMessage) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: newMessage,
          readStatus: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    });
    return () => disconnectSocket();
    }, [email, enabled, loadNotifications]);

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
      if (!newValue) setNotifications([]);
      else loadNotifications();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const formatTime = (time) => new Date(time).toLocaleString();

  return (
    <div className="notification-container" ref={dropdownRef}>

      {/* BELL BUTTON */}
      <div className="notification-icon" onClick={() => setOpen(!open)}>
        <Bell size={17} />
        {enabled && unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="notification-dropdown">

          {/* HEADER */}
          <div className="notification-header">
            <h4 className="notification-title">
              Notifications
              {enabled && unreadCount > 0 && (
                <span style={{
                  marginLeft: 8,
                  fontSize: "0.68rem",
                  background: "rgba(15,98,254,0.1)",
                  color: "#0F62FE",
                  borderRadius: 20,
                  padding: "2px 8px",
                  fontWeight: 600,
                }}>
                  {unreadCount} new
                </span>
              )}
            </h4>

            <div className="notification-actions">
              <button onClick={toggleNotifications}>
                {enabled
                  ? <><BellOff size={11} style={{marginRight:4, verticalAlign:"middle"}}/>Mute</>
                  : <><Bell size={11} style={{marginRight:4, verticalAlign:"middle"}}/>Unmute</>
                }
              </button>
              {enabled && notifications.length > 0 && (
                <>
                  <button onClick={handleMarkAll}>Mark all read</button>
                  <button onClick={handleClearAll}>Clear all</button>
                </>
              )}
            </div>
          </div>

          {/* BODY */}
          {!enabled ? (
            <p className="notification-empty">🔕 Notifications are muted</p>
          ) : notifications.length === 0 ? (
            <p className="notification-empty">You're all caught up 🎉</p>
          ) : (
            <div className="notification-list">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.readStatus ? "unread" : ""}`}
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  {/* DOT */}
                  <div className="notification-dot" />

                  {/* CONTENT */}
                  <div className="notification-content">
                    <p className="notification-message">{n.message}</p>
                    <small className="notification-time">{formatTime(n.createdAt)}</small>
                  </div>

                  {/* DELETE */}
                  <button
                    className="notification-delete-btn"
                    onClick={(e) => handleDelete(e, n.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}