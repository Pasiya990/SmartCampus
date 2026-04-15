import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");

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

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}