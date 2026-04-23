import { Link } from "react-router-dom";
import "./QuickActions.css";

export default function QuickActions() {
  return (
    <div className="actions">

      {/* PRIMARY */}
      <Link to="/tickets/new" className="action-card primary">
        <div className="action-icon">+</div>
        <div className="action-text">
          <h4>Create Ticket</h4>
          <p>Report an issue</p>
        </div>
      </Link>

      <Link to="/resources" className="action-card">
        <div className="action-icon">✔</div>
        <div className="action-text">
          <h4>Book Resource</h4>
          <p>Reserve campus facilities</p>
        </div>
      </Link>

      <Link to="/my-tickets" className="action-card">
        <div className="action-icon">📋</div>
        <div className="action-text">
          <h4>My Tickets</h4>
          <p>View & track issues</p>
        </div>
      </Link>

      <Link to="/my-bookings" className="action-card">
        <div className="action-icon">📅</div>
        <div className="action-text">
          <h4>My Bookings</h4>
          <p>Manage reservations</p>
        </div>
      </Link>

    </div>
  );
}