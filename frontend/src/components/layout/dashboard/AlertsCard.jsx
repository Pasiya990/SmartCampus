import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../../api/notificationApi";
import "./AlertsCard.css";

export default function AlertsCard({ notifications, setNotifications }) {
  const navigate = useNavigate();

  // 🔥 Sort: unread first → newest first
  const sorted = [...notifications].sort((a, b) => {
    if (a.readStatus !== b.readStatus) {
      return a.readStatus ? 1 : -1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleClick = async (n) => {
    try {
      if (!n.readStatus) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === n.id ? { ...item, readStatus: true } : item
          )
        );

        await markAsRead(n.id);
      }

      if (n.message.toLowerCase().includes("ticket")) {
        navigate("/my-tickets");
      } else if (n.message.toLowerCase().includes("booking")) {
        navigate("/my-bookings");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleString();
  };

  return (
    <div className="timeline-card">

      {/* HEADER */}
      <div className="timeline-header">
        <h3>Notifications</h3>
      </div>

      {/* CONTENT */}
      {sorted.length === 0 ? (
        <p className="no-alerts">No new notifications</p>
      ) : (
        <div className="timeline">

          {sorted.slice(0, 5).map((n) => (
            <div
              key={n.id}
              className={`timeline-item ${!n.readStatus ? "unread" : ""}`}
              onClick={() => handleClick(n)}
            >

              {/* DOT */}
              <div className="timeline-dot" />

              {/* CONTENT */}
              <div className="timeline-content">
                <p className="timeline-message">{n.message}</p>
                <span className="timeline-time">
                  {formatTime(n.createdAt)}
                </span>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}