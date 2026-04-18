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
import "./TicketDetails.css";

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

  // 🔥 format minutes to readable time
const formatTime = (minutes) => {
  if (minutes == null) return "N/A";

  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins} mins`;
};

const getTimerColor = (minutes) => {
  if (minutes == null) return "#111c4e";

  if (minutes < 60) return "#16a34a";   // green
  if (minutes < 240) return "#f59e0b";  // orange
  return "#dc2626";                     // red
};

    const token = localStorage.getItem("token");

  let tokenPayload = {};
  if (token) {
    try {
      tokenPayload = JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const currentRole =
    tokenPayload.role ||
    localStorage.getItem("role") ||
    storedUser.role ||
    "USER";

  const currentName =
    tokenPayload.name ||
    localStorage.getItem("name") ||
    storedUser.name ||
    storedUser.fullName ||
    tokenPayload.sub ||
    storedUser.email ||
    "Unknown User";

  const [commentAuthorName] = useState(currentName);
  const [commentAuthorRole] = useState(currentRole);

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
      alert("Please enter technician email.");
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
    return <p className="ticket-details-loading">Loading ticket details...</p>;
  }

  if (errorMessage) {
    return <p className="ticket-details-error">{errorMessage}</p>;
  }

  if (!ticket) {
    return <p className="ticket-details-loading">Ticket not found.</p>;
  }

  return (
    <div className="ticket-details-page">
      <div className="ticket-details-header">
        <div>
          <h2 className="ticket-details-title">Ticket Details</h2>
          <p className="ticket-details-subtitle">
            Full incident information and workflow actions
          </p>
        </div>
      </div>

      <div className="ticket-details-topbar">
        <div className="ticket-details-code-block">
          <span className="ticket-details-code-label">Ticket Code</span>
          <span className="ticket-details-code-value">{ticket.ticketCode}</span>
        </div>

        <div className="ticket-details-badges">
          <span
            className={`ticket-details-badge ticket-details-priority-${ticket.priority?.toLowerCase()}`}
          >
            {ticket.priority}
          </span>
          <span
            className={`ticket-details-badge ticket-details-status-${ticket.status?.toLowerCase()}`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="ticket-details-timer-row">
  <div className="ticket-details-timer-card">
    <span className="ticket-details-timer-title">Timer Status</span>
    <span className="ticket-details-timer-value">
      {ticket.timerLabel || "N/A"}
    </span>
  </div>

  <div className="ticket-details-timer-card">
    <span className="ticket-details-timer-title">Ticket Age</span>
    <span
  className="ticket-details-timer-value"
  style={{ color: getTimerColor(ticket.ageInMinutes) }}
>
  {formatTime(ticket.ageInMinutes)}
</span>
  </div>

  <div className="ticket-details-timer-card">
    <span className="ticket-details-timer-title">Resolved In</span>
    <span className="ticket-details-timer-value">
      {ticket.resolutionTimeInMinutes != null
  ? formatTime(ticket.resolutionTimeInMinutes)
  : "Not resolved yet"}
    </span>
  </div>
</div>

      <div className="ticket-details-card">
        <div className="ticket-details-card-header">
          <h3>Incident Information</h3>
        </div>

        <div className="ticket-details-grid">
          <div className="ticket-details-field">
            <span className="ticket-details-label">ID</span>
            <span className="ticket-details-value">{ticket.id}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Category</span>
            <span className="ticket-details-value">{ticket.category}</span>
          </div>

          <div className="ticket-details-field ticket-details-field-wide">
            <span className="ticket-details-label">Title</span>
            <span className="ticket-details-value">{ticket.title}</span>
          </div>

          <div className="ticket-details-field ticket-details-field-wide">
            <span className="ticket-details-label">Description</span>
            <span className="ticket-details-value">{ticket.description}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Location</span>
            <span className="ticket-details-value">{ticket.location}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Resource Name</span>
            <span className="ticket-details-value">{ticket.resourceName || "N/A"}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Preferred Contact</span>
            <span className="ticket-details-value">{ticket.preferredContact}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Contact Name</span>
            <span className="ticket-details-value">{ticket.contactName || "N/A"}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Reported By</span>
            <span className="ticket-details-value">{ticket.reportedBy}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Assigned Technician</span>
            <span className="ticket-details-value">
              {ticket.assignedTechnician || "Not Assigned"}
            </span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Rejection Reason</span>
            <span className="ticket-details-value">{ticket.rejectionReason || "N/A"}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Resolution Notes</span>
            <span className="ticket-details-value">{ticket.resolutionNotes || "N/A"}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Created At</span>
            <span className="ticket-details-value">{ticket.createdAt}</span>
          </div>

          <div className="ticket-details-field">
            <span className="ticket-details-label">Updated At</span>
            <span className="ticket-details-value">{ticket.updatedAt || "N/A"}</span>
          </div>
        </div>
      </div>

      

      {ticket.attachments && ticket.attachments.length > 0 && (
        <div className="ticket-details-card">
          <div className="ticket-details-card-header">
            <h3>Attachments</h3>
          </div>

          <div className="ticket-details-attachments">
            {ticket.attachments.map((attachment) => (
              <div className="ticket-details-attachment-item" key={attachment.id}>
                <img
                  src={attachment.fileUrl}
                  alt={attachment.fileName}
                  className="ticket-details-attachment-image"
                />
                <p className="ticket-details-attachment-name">{attachment.fileName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentRole === "ADMIN" && (
        <div className="ticket-details-card">
          <div className="ticket-details-card-header">
            <h3>Assign Technician</h3>
          </div>

          <form className="ticket-details-form-inline" onSubmit={handleAssignTechnician}>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="ticket-details-select"
              placeholder="Enter technician email"
            />

            <button type="submit" className="ticket-details-primary-btn">
              Assign
            </button>
          </form>

          <p className="ticket-details-helper-text">
            Current: {ticket.assignedTechnician || "Not Assigned"}
          </p>
        </div>
      )}

      {(currentRole === "ADMIN" || currentRole === "TECHNICIAN") && (
        <div className="ticket-details-card">
          <div className="ticket-details-card-header">
            <h3>Update Status</h3>
          </div>

          <form className="ticket-details-status-form" onSubmit={handleUpdateStatus}>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="ticket-details-select"
            >
              <option value="">Select Status</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            {statusValue === "RESOLVED" && (
              <div className="ticket-details-form-group">
                <label>Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows="4"
                  className="ticket-details-textarea"
                />
              </div>
            )}

            {statusValue === "REJECTED" && (
              <div className="ticket-details-form-group">
                <label>Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  className="ticket-details-textarea"
                />
              </div>
            )}

            <button type="submit" className="ticket-details-primary-btn">
              Update Status
            </button>
          </form>
        </div>
      )}

      <div className="ticket-details-card">
        <div className="ticket-details-card-header">
          <h3>Comments</h3>
        </div>

        {comments.length === 0 ? (
          <p className="ticket-details-muted-text">No comments yet.</p>
        ) : (
          <div className="ticket-details-comments-list">
            {comments.map((comment) => (
              <div className="ticket-details-comment-item" key={comment.id}>
                <div className="ticket-details-comment-top">
                  <div>
                    <span className="ticket-details-comment-author">
                      {comment.authorName}
                    </span>
                    <span className="ticket-details-comment-role">
                      ({comment.authorRole})
                    </span>
                  </div>
                  <span className="ticket-details-comment-date">
                    {comment.createdAt}
                  </span>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="ticket-details-comment-edit">
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows="4"
                      className="ticket-details-textarea"
                    />
                    <div className="ticket-details-comment-actions">
                      <button
                        type="button"
                        className="ticket-details-primary-btn"
                        onClick={() => handleUpdateComment(comment.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="ticket-details-secondary-btn"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditMessage("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="ticket-details-comment-message">{comment.message}</p>
                    <div className="ticket-details-comment-actions">
                      <button
                        type="button"
                        className="ticket-details-link-btn"
                        onClick={() => handleEditClick(comment)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ticket-details-link-btn ticket-details-delete-link"
                        onClick={() => handleDeleteComment(comment.id)}
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

        <form className="ticket-details-comment-form" onSubmit={handleAddComment}>
          <div className="ticket-details-comment-identity">
            <strong>Commenting as:</strong> {commentAuthorName} ({commentAuthorRole})
          </div>

          <div className="ticket-details-form-group">
            <label>Message</label>
            <textarea
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              rows="4"
              className="ticket-details-textarea"
              required
            />
          </div>

          <button
            type="submit"
            className="ticket-details-primary-btn"
            disabled={commentLoading}
          >
            {commentLoading ? "Adding..." : "Add Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;