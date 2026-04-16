import React, { useEffect, useMemo, useState } from "react";
import { getAllTickets } from "../../api/ticketApi";
import { Link } from "react-router-dom";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const userName = localStorage.getItem("name") || "";
  const userEmail = localStorage.getItem("email") || "";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTickets();
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

  const myTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const reportedBy = (ticket.reportedBy || "").toLowerCase();
      const nameMatch = userName && reportedBy === userName.toLowerCase();
      const emailMatch = userEmail && reportedBy === userEmail.toLowerCase();
      return nameMatch || emailMatch;
    });
  }, [tickets, userName, userEmail]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading your tickets...</p>;
  }

  if (errorMessage) {
    return <p style={{ padding: "20px", color: "red" }}>{errorMessage}</p>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "24px" }}>
      <h2>My Tickets</h2>

      {myTickets.length === 0 ? (
        <p>No tickets found for your account.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Ticket Code</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>View Details</th>
            </tr>
          </thead>
          <tbody>
            {myTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td style={tdStyle}>{ticket.ticketCode}</td>
                <td style={tdStyle}>{ticket.title}</td>
                <td style={tdStyle}>{ticket.category}</td>
                <td style={tdStyle}>{ticket.priority}</td>
                <td style={tdStyle}>{ticket.status}</td>
                <td style={tdStyle}>{ticket.location}</td>
                <td style={tdStyle}>
                  <Link
                    to={`/tickets/${ticket.id}`}
                    style={{
                      color: "#720e9e",
                      fontWeight: "600",
                      textDecoration: "underline",
                    }}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  color: "#555",
  fontSize: "13px",
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

export default MyTickets;