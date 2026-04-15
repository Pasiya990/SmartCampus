import { useEffect, useState } from "react";
import API from "../services/api";

export default function TechnicianView() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/technician/test")
      .then(res => setMessage(res.data))
      .catch(() => setMessage("Access Denied"));
  }, []);

  return (
    <div>
      <h2>Technician Panel</h2>
      <p>{message}</p>
    </div>
  );
}