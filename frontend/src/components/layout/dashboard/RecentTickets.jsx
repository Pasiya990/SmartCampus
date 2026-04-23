import "./RecentTickets.css";
import { Link } from "react-router-dom";

export default function RecentTickets({ tickets }) {
  return (
    <div className="card large">

      {/* HEADER */}
      <div className="card-header">
        <h3>Recent Tickets</h3>
        <Link to="/my-tickets" className="view-all">View All</Link>
      </div>

      {/* COLUMN HEADERS */}
      <div className="ticket-table-header">
        <span>Issue</span>
        <span>Location</span>
        <span>Date</span>
        <span>Status</span>
      </div>

      {/* DATA */}
      {tickets.length === 0 ? (
        <p className="empty">No tickets</p>
      ) : (
        tickets.slice(0, 3).map((t) => (
          <div key={t.id} className="ticket-row">

            {/* ISSUE */}
            <div className="ticket-issue">
              <div className="ticket-icon">⚙️</div>
              <span>{t.title}</span>
            </div>

            {/* LOCATION */}
            <span className="ticket-location">{t.location}</span>

            {/* DATE */}
            <span className="ticket-date">
              {new Date(t.createdAt || t.date).toLocaleDateString()}
            </span>

            {/* STATUS */}
            <span className={`status ${t.status?.toLowerCase()}`}>
              {t.status}
            </span>

          </div>
        ))
      )}

    </div>
  );
}