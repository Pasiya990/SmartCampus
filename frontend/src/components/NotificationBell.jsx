import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../api/notificationApi";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔥 get email from token
  const token = localStorage.getItem("token");

  let email = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.sub; // or payload.email depending on your backend
    } catch {}
  }

  const loadNotifications = async () => {
    if (!email) return;

    const data = await getNotifications(email);
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();

    // auto refresh every 10s
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [email]);

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    loadNotifications();
  };

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🔔 Bell */}
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && `(${unreadCount})`}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "40px",
          width: "300px",
          background: "white",
          border: "1px solid #ddd",
          padding: "10px",
          zIndex: 1000
        }}>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "8px",
                  marginBottom: "5px",
                  background: n.readStatus ? "#f5f5f5" : "#e6f7ff",
                  cursor: "pointer"
                }}
                onClick={() => handleMarkAsRead(n.id)}
              >
                <p style={{ margin: 0 }}>{n.message}</p>
                <small>{n.createdAt}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}