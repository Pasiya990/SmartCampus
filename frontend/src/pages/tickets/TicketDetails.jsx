import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketById,
  getCommentsByTicketId,
  addComment,
  updateComment,
  deleteComment,
  assignTechnician,
  updateTicketStatus,
} from "../../api/ticketApi";

const TicketDetails = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  const [technicianName, setTechnicianName] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const storedRole = localStorage.getItem("role") || storedUser.role || "USER";
  const storedName =
    localStorage.getItem("name") ||
    storedUser.name ||
    storedUser.fullName ||
    storedUser.email ||
    "Unknown User";

  const currentRole = storedRole;

  const [commentAuthorName] = useState(storedName);
  const [commentAuthorRole] = useState(storedRole);

  const techniciansByCategory = {
    IT_EQUIPMENT: ["Tech IT 1", "Tech IT 2"],
    HVAC: ["Tech HVAC 1", "Tech HVAC 2"],
    STRUCTURAL: ["Tech Structural 1"],
    ELECTRICAL: ["Tech Electrical 1", "Tech Electrical 2"],
    PLUMBING: ["Tech Plumbing 1", "Tech Plumbing 2"],
    SECURITY: ["Tech Security 1", "Tech Security 2"],
    OTHER: ["General Technician"],
  };

  const availableTechnicians = techniciansByCategory[ticket?.category] || [];

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

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditMessage(comment.message);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editMessage.trim()) {
      alert("Please enter updated comment message.");
      return;
    }

    try {
      await updateComment(commentId, {
        editorName: commentAuthorName,
        editorRole: commentAuthorRole,
        message: editMessage,
      });

      setEditingCommentId(null);
      setEditMessage("");
      await fetchComments();
    } catch (error) {
      console.error("Update comment error:", error);
      alert("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId, {
        actorName: commentAuthorName,
        actorRole: commentAuthorRole,
      });

      await fetchComments();
    } catch (error) {
      console.error("Delete comment error:", error);
      alert("Failed to delete comment.");
    }
  };

  const handleAssignTechnician = async (e) => {
    e.preventDefault();

    if (!technicianName.trim()) {
      alert("Please select a technician.");
      return;
    }

    try {
      await assignTechnician(id, technicianName);
      setTechnicianName("");
      await fetchTicketDetails();
      alert("Technician assigned successfully.");
    } catch (error) {
      console.error("Assign technician error:", error);
      alert("Failed to assign technician.");
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!statusValue) {
      alert("Please select a status.");
      return;
    }

    const payload = { status: statusValue };

    if (statusValue === "RESOLVED") {
      payload.resolutionNotes = resolutionNotes;
    }

    if (statusValue === "REJECTED") {
      payload.rejectionReason = rejectionReason;
    }

    try {
      await updateTicketStatus(id, payload);
      setStatusValue("");
      setResolutionNotes("");
      setRejectionReason("");
      await fetchTicketDetails();
      alert("Status updated successfully.");
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update status.");
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

      {currentRole === "ADMIN" && (
        <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "24px" }}>
          <h3>Assign Technician</h3>
          <form onSubmit={handleAssignTechnician}>
            <select
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              style={{ marginRight: "10px" }}
            >
              <option value="">Select Technician</option>
              {availableTechnicians.map((tech, index) => (
                <option key={index} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
            <button type="submit">Assign</button>
          </form>

          <p style={{ marginTop: "10px" }}>
            Current: {ticket.assignedTechnician || "Not Assigned"}
          </p>

          {availableTechnicians.length === 0 && (
            <p style={{ color: "gray" }}>No technicians available for this category.</p>
          )}
        </div>
      )}

      {(currentRole === "ADMIN" || currentRole === "TECHNICIAN") && (
        <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "24px" }}>
          <h3>Update Status</h3>
          <form onSubmit={handleUpdateStatus}>
            <div style={{ marginBottom: "10px" }}>
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {statusValue === "RESOLVED" && (
              <div style={{ marginBottom: "10px" }}>
                <label>Resolution Notes</label><br />
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows="3"
                  style={{ width: "100%" }}
                />
              </div>
            )}

            {statusValue === "REJECTED" && (
              <div style={{ marginBottom: "10px" }}>
                <label>Rejection Reason</label><br />
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  style={{ width: "100%" }}
                />
              </div>
            )}

            <button type="submit">Update Status</button>
          </form>
        </div>
      )}

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

                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows="3"
                      style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <button onClick={() => handleUpdateComment(comment.id)}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditMessage("");
                      }}
                      style={{ marginLeft: "8px" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{comment.message}</p>
                    <small>{comment.createdAt}</small>
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={() => handleEditClick(comment)}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
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