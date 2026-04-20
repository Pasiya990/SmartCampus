import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function UserDashboard() {
  const [message, setMessage] = useState("");

  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    API.get("/user/hello")
      .then((res) => setMessage(res.data))
      .catch(() => setMessage("Access Denied"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>User Dashboard</h2>
      <p>Welcome, {name}</p>
      <p>{message}</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        
        <Link
          to="/tickets/new"
          style={{
            backgroundColor: "#720e9e",
            color: "#ffffff",
            padding: "10px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          + Add New Ticket
        </Link>

        <Link
          to="/my-tickets"
          style={{
            backgroundColor: "#ffffff",
            color: "#720e9e",
            padding: "10px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            border: "1px solid #720e9e",
          }}
        >
          View My Tickets
        </Link>

        {/* ✅ NEW BUTTON */}
        <Link
          to="/my-bookings"
          style={{
            backgroundColor: "#720e9e",
            color: "#ffffff",
            padding: "10px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          My Bookings
        </Link>

        <Link
          to="/resources"
          style={{
            backgroundColor: "#ffffff",
            color: "#720e9e",
            padding: "10px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            border: "1px solid #720e9e",
          }}
        >
          View Resources
        </Link>

      </div>
    </div>
  );
}