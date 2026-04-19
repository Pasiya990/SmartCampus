import React, { useEffect, useMemo, useState } from "react";
import { getMyTickets } from "../../api/ticketApi";
import { Link } from "react-router-dom";
import "./MyTickets.css";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error("Fetch my tickets error:", error);
        setErrorMessage("Failed to load your tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter ? ticket.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, statusFilter]);

  const totalTickets = tickets.length;
  const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;
  const rejectedCount = tickets.filter(
    (ticket) => ticket.status === "REJECTED"
  ).length;
  const closedCount = tickets.filter((ticket) => ticket.status === "CLOSED").length;

  if (loading) {
    return <p className="my-tickets-loading">Loading your tickets...</p>;
  }

  if (errorMessage) {
    return <p className="my-tickets-error">{errorMessage}</p>;
  }

  return (
    <div className="my-tickets-page">
      <div className="my-tickets-header">
        <div>
          <h2 className="my-tickets-title">My Tickets</h2>
          <p className="my-tickets-subtitle">
            Track incidents you have reported
          </p>
        </div>
      </div>

      <div className="my-tickets-summary-grid">
        <div className="my-tickets-summary-card my-tickets-summary-total">
          <span className="my-tickets-summary-label">Total</span>
          <span className="my-tickets-summary-value">{totalTickets}</span>
        </div>

        <div className="my-tickets-summary-card my-tickets-summary-open">
          <span className="my-tickets-summary-label">Open</span>
          <span className="my-tickets-summary-value">{openCount}</span>
        </div>

        <div className="my-tickets-summary-card my-tickets-summary-progress">
          <span className="my-tickets-summary-label">In Progress</span>
          <span className="my-tickets-summary-value">{inProgressCount}</span>
        </div>

        <div className="my-tickets-summary-card my-tickets-summary-resolved">
          <span className="my-tickets-summary-label">Resolved</span>
          <span className="my-tickets-summary-value">{resolvedCount}</span>
        </div>

        <div className="my-tickets-summary-card my-tickets-summary-rejected">
          <span className="my-tickets-summary-label">Rejected</span>
          <span className="my-tickets-summary-value">{rejectedCount}</span>
        </div>

        <div className="my-tickets-summary-card my-tickets-summary-closed">
          <span className="my-tickets-summary-label">Closed</span>
          <span className="my-tickets-summary-value">{closedCount}</span>
        </div>
      </div>

      <div className="my-tickets-card">
        <div className="my-tickets-toolbar">
          <div className="my-tickets-toolbar-left">
            <input
              type="text"
              placeholder="Search by title or ticket code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="my-tickets-search"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="my-tickets-select"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="my-tickets-toolbar-right">
            <button
              className="my-tickets-clear-btn"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="my-tickets-results-row">
          <span className="my-tickets-results-text">
            Showing <strong>{filteredTickets.length}</strong> ticket(s)
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <p className="my-tickets-empty">No tickets found for your account.</p>
        ) : (
          <div className="my-tickets-table-wrapper">
            <table className="my-tickets-table">
              <thead>
                <tr>
                  <th>Ticket Code</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="my-tickets-code-cell">{ticket.ticketCode}</td>
                    <td className="my-tickets-title-cell">{ticket.title}</td>
                    <td>{ticket.category}</td>
                    <td>
                      <span
                        className={`my-tickets-badge my-tickets-priority-${ticket.priority?.toLowerCase()}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`my-tickets-badge my-tickets-status-${ticket.status?.toLowerCase()}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.location}</td>
                    <td>
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="my-tickets-view-link"
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
};

export default MyTickets;