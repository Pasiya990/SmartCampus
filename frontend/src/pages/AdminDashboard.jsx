import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/test")
      .then(res => setMessage(res.data))
      .catch(err => {
        if (err.response?.status === 403) {
          setMessage("Forbidden - You are not allowed");
        } else {
          setMessage("Error occurred");
        }
      });
  }, []);

  const handleViewTickets = () => {
    navigate("/tickets"); // ✅ updated path
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>

      <button onClick={handleViewTickets}>
        View All Tickets
      </button>
    </div>
  );
}