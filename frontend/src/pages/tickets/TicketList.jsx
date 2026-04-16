import React, { useEffect, useMemo, useState } from "react";
import { getAllTickets } from "../../api/ticketApi";
import { Link } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

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

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading tickets...</p>;
  }

  if (errorMessage) {
    return <p style={{ padding: "20px", color: "red" }}>{errorMessage}</p>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "24px" }}>
      <h2>Ticket List</h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by title, code, or reported by"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", minWidth: "260px" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px" }}
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
          style={{ padding: "8px" }}
        >
          <option value="">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
            setPriorityFilter("");
          }}
          style={{ padding: "8px 14px" }}
        >
          Clear Filters
        </button>
      </div>

      <p style={{ marginBottom: "16px" }}>
        <strong>Total Results:</strong> {filteredTickets.length}
      </p>

      {filteredTickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
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
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.ticketCode}</td>
                <td>
                  <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                </td>
                <td>{ticket.category}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.status}</td>
                <td>{ticket.location}</td>
                <td>{ticket.resourceName}</td>
                <td>{ticket.reportedBy}</td>
                <td>{ticket.assignedTechnician || "Not Assigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketList;