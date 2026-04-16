import React, { useEffect, useState } from "react";
import { getAllTickets } from "../../api/ticketApi";
import { Link } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading tickets...</p>;
  }

  if (errorMessage) {
    return <p style={{ padding: "20px", color: "red" }}>{errorMessage}</p>;
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "24px" }}>
      <h2>Ticket List</h2>

      {tickets.length === 0 ? (
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
  {tickets.map((ticket) => (
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