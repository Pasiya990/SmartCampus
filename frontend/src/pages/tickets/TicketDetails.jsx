import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../../api/ticketApi";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
      } catch (error) {
        console.error("Fetch ticket details error:", error);
        setErrorMessage("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading ticket details...</p>;
  }

  if (errorMessage) {
    return <p style={{ padding: "20px", color: "red" }}>{errorMessage}</p>;
  }

  if (!ticket) {
    return <p style={{ padding: "20px" }}>Ticket not found.</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "24px" }}>
      <h2>Ticket Details</h2>

      <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
        <p><strong>ID:</strong> {ticket.id}</p>
        <p><strong>Ticket Code:</strong> {ticket.ticketCode}</p>
        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Location:</strong> {ticket.location}</p>
        <p><strong>Resource Name:</strong> {ticket.resourceName}</p>
        <p><strong>Preferred Contact:</strong> {ticket.preferredContact}</p>
        <p><strong>Contact Name:</strong> {ticket.contactName}</p>
        <p><strong>Reported By:</strong> {ticket.reportedBy}</p>
        <p><strong>Assigned Technician:</strong> {ticket.assignedTechnician || "Not Assigned"}</p>
        <p><strong>Rejection Reason:</strong> {ticket.rejectionReason || "N/A"}</p>
        <p><strong>Resolution Notes:</strong> {ticket.resolutionNotes || "N/A"}</p>
        <p><strong>Created At:</strong> {ticket.createdAt}</p>
        <p><strong>Updated At:</strong> {ticket.updatedAt || "N/A"}</p>

        <div style={{ marginTop: "20px" }}>
          <strong>Attachments:</strong>
          {ticket.attachments && ticket.attachments.length > 0 ? (
            <div style={{ marginTop: "10px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {ticket.attachments.map((attachment) => (
                <div key={attachment.id}>
                  <img
                    src={attachment.fileUrl}
                    alt={attachment.fileName}
                    style={{
                      width: "180px",
                      height: "140px",
                      objectFit: "cover",
                      border: "1px solid #ccc"
                    }}
                  />
                  <p style={{ maxWidth: "180px", wordBreak: "break-word" }}>
                    {attachment.fileName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No attachments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;