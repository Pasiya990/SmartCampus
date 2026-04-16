import React, { useEffect, useMemo, useState } from "react";
import { getAllTickets } from "../../api/ticketApi";
import { Link } from "react-router-dom";
import "./TicketList.css";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (error) {
        console.error("Fetch tickets error:", error);
        setErrorMessage("Failed to load tickets.");
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
        ticket.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
      const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
      const matchesUnassigned = unassignedOnly
        ? !ticket.assignedTechnician || ticket.assignedTechnician.trim() === ""
        : true;

      return matchesSearch && matchesStatus && matchesPriority && matchesUnassigned;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, unassignedOnly]);

  const totalTickets = tickets.length;
  const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const inProgressCount = tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((ticket) => ticket.status === "RESOLVED").length;
  const rejectedCount = tickets.filter((ticket) => ticket.status === "REJECTED").length;
  const closedCount = tickets.filter((ticket) => ticket.status === "CLOSED").length;
  const unassignedCount = tickets.filter(
    (ticket) => !ticket.assignedTechnician || ticket.assignedTechnician.trim() === ""
  ).length;

  if (loading) {
    return <p className="ticket-list-loading">Loading tickets...</p>;
  }

  if (errorMessage) {
    return <p className="ticket-list-error">{errorMessage}</p>;
  }

  return (
    <div className="ticket-list-page">
      <div className="ticket-list-header">
        <div>
          <h2 className="ticket-list-title">Incident Tickets</h2>
          <p className="ticket-list-subtitle">
            Admin inbox for newly reported and active incidents
          </p>
        </div>
      </div>

      <div className="ticket-list-summary-grid">
        <div className="ticket-list-summary-card ticket-list-summary-total">
          <span className="ticket-list-summary-label">Total</span>
          <span className="ticket-list-summary-value">{totalTickets}</span>
        </div>

        <div className="ticket-list-summary-card ticket-list-summary-open">
          <span className="ticket-list-summary-label">Open</span>
          <span className="ticket-list-summary-value">{openCount}</span>
        </div>

        <div className="ticket-list-summary-card ticket-list-summary-progress">
          <span className="ticket-list-summary-label">In Progress</span>
          <span className="ticket-list-summary-value">{inProgressCount}</span>
        </div>

        <div className="ticket-list-summary-card ticket-list-summary-resolved">
          <span className="ticket-list-summary-label">Resolved</span>
          <span className="ticket-list-summary-value">{resolvedCount}</span>
        </div>

        <div className="ticket-list-summary-card ticket-list-summary-rejected">
          <span className="ticket-list-summary-label">Rejected</span>
          <span className="ticket-list-summary-value">{rejectedCount}</span>
        </div>

        <div className="ticket-list-summary-card ticket-list-summary-closed">
          <span className="ticket-list-summary-label">Closed</span>
          <span className="ticket-list-summary-value">{closedCount}</span>
        </div>

        <div className="ticket-list-summary-card ticket-list-summary-unassigned">
          <span className="ticket-list-summary-label">Unassigned</span>
          <span className="ticket-list-summary-value">{unassignedCount}</span>
        </div>
      </div>

      <div className="ticket-list-card">
        <div className="ticket-list-toolbar">
          <div className="ticket-list-toolbar-left">
            <input
              type="text"
              placeholder="Search by title, ticket code, or reported by"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ticket-list-search"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ticket-list-select"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="ticket-list-select"
            >
              <option value="">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            <label className="ticket-list-checkbox">
              <input
                type="checkbox"
                checked={unassignedOnly}
                onChange={(e) => setUnassignedOnly(e.target.checked)}
              />
              <span>Unassigned only</span>
            </label>
          </div>

          <div className="ticket-list-toolbar-right">
            <button
              className="ticket-list-clear-btn"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPriorityFilter("");
                setUnassignedOnly(false);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="ticket-list-results-row">
          <span className="ticket-list-results-text">
            Showing <strong>{filteredTickets.length}</strong> ticket(s)
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <p className="ticket-list-empty">No tickets found.</p>
        ) : (
          <div className="ticket-list-table-wrapper">
            <table className="ticket-list-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ticket Code</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Resource Name</th>
                  <th>Reported By</th>
                  <th>Assigned Technician</th>
                  <th>View Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td className="ticket-list-code-cell">{ticket.ticketCode}</td>
                    <td className="ticket-list-title-cell">{ticket.title}</td>
                    <td>{ticket.category}</td>
                    <td>
                      <span
                        className={`ticket-list-badge ticket-list-priority-${ticket.priority?.toLowerCase()}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`ticket-list-badge ticket-list-status-${ticket.status?.toLowerCase()}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.location}</td>
                    <td>{ticket.resourceName}</td>
                    <td>{ticket.reportedBy}</td>
                    <td>{ticket.assignedTechnician || "Not Assigned"}</td>
                    <td>
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="ticket-list-view-link"
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

export default TicketList;