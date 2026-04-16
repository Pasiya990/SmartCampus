import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketById,
  getCommentsByTicketId,
  addComment,
} from "../../api/ticketApi";

const TicketDetails = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const storedRole = localStorage.getItem("role") || storedUser.role || "USER";
  const storedName =
    localStorage.getItem("name") ||
    storedUser.name ||
    storedUser.fullName ||
    storedUser.email ||
    "Unknown User";

  const [commentAuthorName] = useState(storedName);
  const [commentAuthorRole] = useState(storedRole);

  const fetchTicketDetails = async () => {
    try {
      const data = await getTicketById(id);
      setTicket(data);
    } catch (error) {
      console.error("Fetch ticket details error:", error);
      setErrorMessage("Failed to load ticket details.");
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByTicketId(id);
      setComments(data);
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTicketDetails();
      await fetchComments();
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentMessage.trim()) {
      alert("Please enter a comment message.");
      return;
    }

    try {
      setCommentLoading(true);

      await addComment(id, {
        authorName: commentAuthorName,
        authorRole: commentAuthorRole,
        message: commentMessage,
      });

      setCommentMessage("");
      await fetchComments();
    } catch (error) {
      console.error("Add comment error:", error);
      alert("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

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
                      border: "1px solid #ccc",
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

      <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "24px" }}>
        <h3>Comments</h3>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                }}
              >
                <p><strong>{comment.authorName}</strong> ({comment.authorRole})</p>
                <p>{comment.message}</p>
                <small>{comment.createdAt}</small>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment}>
          <div style={{ marginBottom: "12px" }}>
            <strong>Commenting as:</strong> {commentAuthorName} ({commentAuthorRole})
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Message</label><br />
            <textarea
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              rows="4"
              style={{ width: "100%" }}
              required
            />
          </div>

          <button type="submit" disabled={commentLoading}>
            {commentLoading ? "Adding..." : "Add Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;