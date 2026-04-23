import { Link } from "react-router-dom";

export default function QuickActions() {
  return (
    <div className="actions">

      <Link to="/tickets/new" className="action primary">
        <h4>Create Ticket</h4>
        <p>Report an issue</p>
      </Link>

      <Link to="/book" className="action">
        <h4>Book Resource</h4>
        <p>Reserve campus facilities</p>
      </Link>

      <Link to="/my-tickets" className="action">
        <h4>My Tickets</h4>
        <p>View & track issues</p>
      </Link>

      <Link to="/my-bookings" className="action">
        <h4>My Bookings</h4>
        <p>Manage reservations</p>
      </Link>

    </div>
  );
}