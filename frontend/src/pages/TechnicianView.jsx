import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function TechnicianView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Get technician name from localStorage (from login)
  const technicianName =
    localStorage.getItem("name") ||
    JSON.parse(localStorage.getItem("user"))?.name ||
    "";

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        const response = await API.get(
          `/api/tickets/assigned-technician/${encodeURIComponent(technicianName)}`
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching technician tickets:", error);
        setErrorMessage("Failed to load assigned tickets");
      } finally {
        setLoading(false);
      }
    };

    if (technicianName) {
      fetchAssignedTickets();
    } else {
      setErrorMessage("Technician name not found");
      setLoading(false);
    }
  }, [technicianName]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading assigned tickets...</p>;
  }

  if (errorMessage) {
    return (
      <p style={{ padding: "20px", color: "red" }}>
        {errorMessage}
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "24px" }}>
      <h2 style={{ marginBottom: "8px" }}>Technician Dashboard</h2>
      <p style={{ color: "#555" }}>Welcome, {technicianName}</p>

      <h3 style={{ marginTop: "30px" }}>Assigned Tickets</h3>

      {tickets.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No tickets assigned.</p>
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
              <th style={thStyle}>View</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td style={tdStyle}>{ticket.ticketCode}</td>
                <td style={tdStyle}>{ticket.title}</td>
                <td style={tdStyle}>{ticket.category}</td>

                {/* Priority with color */}
                <td style={tdStyle}>
                  <span style={getPriorityStyle(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </td>

                {/* Status with color */}
                <td style={tdStyle}>
                  <span style={getStatusStyle(ticket.status)}>
                    {ticket.status}
                  </span>
                </td>

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
}

/* ---------- styles ---------- */

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  fontSize: "13px",
  color: "#666",
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

/* ---------- status colors ---------- */

const getStatusStyle = (status) => {
  switch (status) {
    case "OPEN":
      return badge("#e3f2fd", "#1976d2");
    case "IN_PROGRESS":
      return badge("#fff3e0", "#ef6c00");
    case "RESOLVED":
      return badge("#e8f5e9", "#2e7d32");
    case "CLOSED":
      return badge("#eceff1", "#455a64");
    case "REJECTED":
      return badge("#fdecea", "#c62828");
    default:
      return badge("#f5f5f5", "#555");
  }
};

/* ---------- priority colors ---------- */

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "CRITICAL":
      return badge("#fdecea", "#c62828");
    case "HIGH":
      return badge("#fff3e0", "#ef6c00");
    case "MEDIUM":
      return badge("#e3f2fd", "#1565c0");
    case "LOW":
      return badge("#f1f8e9", "#558b2f");
    default:
      return badge("#f5f5f5", "#555");
  }
};

const badge = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
});