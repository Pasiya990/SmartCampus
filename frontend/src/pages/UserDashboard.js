import { useEffect, useState } from "react";
import API from "../services/api";

export default function UserDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/user/hello")
      .then(res => setMessage(res.data))
      .catch(() => setMessage("Access Denied"));
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}