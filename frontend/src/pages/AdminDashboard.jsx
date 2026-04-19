import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import './Bookings.css';

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
    navigate("/tickets");
  };

  
  const handleViewBookings = () => {
    navigate("/admin/bookings");
  };

  const handleViewResources = () => {
  navigate("/resources"); 
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>

      <button onClick={handleViewTickets}>
        View All Tickets
      </button>

      
      <button onClick={handleViewBookings} style={{ marginLeft: "10px" }}>
        View All Bookings
      </button>

      <button onClick={handleViewResources} style={{ marginLeft: "10px" }}>
      View Resource Catalogue
      </button>
    </div>
  );
}