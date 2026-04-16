import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./TechnicianView.css";

export default function TechnicianView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const technicianEmail =
    localStorage.getItem("email") ||
    JSON.parse(localStorage.getItem("user"))?.email ||
    "";

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        const response = await API.get(
          `/api/tickets/assigned-technician/${encodeURIComponent(technicianEmail)}`
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching technician tickets:", error);
        setErrorMessage("Failed to load assigned tickets.");
      } finally {
        setLoading(false);
      }
    };

    if (technicianEmail) {
      fetchAssignedTickets();
    } else {
      setErrorMessage("Technician email not found.");
      setLoading(false);
    }
  }, [technicianEmail]);

  const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;
  const closedCount = tickets.filter((ticket) => ticket.status === "CLOSED").length;

  if (loading) {
    return <p className="technician-loading">Loading assigned tickets...</p>;
  }

  if (errorMessage) {
    return <p className="technician-error">{errorMessage}</p>;
  }

  return (
    <div className="technician-page">
      <div className="technician-header">
        <div>
          <h2 className="technician-title">Technician Dashboard</h2>
          <p className="technician-subtitle">
            View and manage incidents assigned to you
          </p>
        </div>
      </div>

      <div className="technician-welcome-card">
        <span className="technician-welcome-label">Logged in as</span>
        <span className="technician-welcome-value">{technicianEmail}</span>
      </div>

      <div className="technician-summary-grid">
        <div className="technician-summary-card technician-summary-total">
          <span className="technician-summary-label">Total Assigned</span>
          <span className="technician-summary-value">{tickets.length}</span>
        </div>

        <div className="technician-summary-card technician-summary-open">
          <span className="technician-summary-label">Open</span>
          <span className="technician-summary-value">{openCount}</span>
        </div>

        <div className="technician-summary-card technician-summary-progress">
          <span className="technician-summary-label">In Progress</span>
          <span className="technician-summary-value">{inProgressCount}</span>
        </div>

        <div className="technician-summary-card technician-summary-resolved">
          <span className="technician-summary-label">Resolved</span>
          <span className="technician-summary-value">{resolvedCount}</span>
        </div>

        <div className="technician-summary-card technician-summary-closed">
          <span className="technician-summary-label">Closed</span>
          <span className="technician-summary-value">{closedCount}</span>
        </div>
      </div>

      <div className="technician-card">
        <div className="technician-card-top">
          <h3 className="technician-section-title">Assigned Tickets</h3>
          <span className="technician-result-count">
            {tickets.length} ticket(s)
          </span>
        </div>

        {tickets.length === 0 ? (
          <p className="technician-empty">No tickets assigned.</p>
        ) : (
          <div className="technician-table-wrapper">
            <table className="technician-table">
              <thead>
                <tr>
                  <th>Ticket Code</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="technician-code-cell">{ticket.ticketCode}</td>
                    <td className="technician-title-cell">{ticket.title}</td>
                    <td>{ticket.category}</td>

                    <td>
                      <span
                        className={`technician-badge technician-priority-${ticket.priority?.toLowerCase()}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`technician-badge technician-status-${ticket.status?.toLowerCase()}`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td>{ticket.location}</td>

                    <td>
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="technician-view-link"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}