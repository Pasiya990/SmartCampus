import React, { useState } from "react";
import { createTicket } from "../../api/ticketApi";
import "./TicketCreate.css";

const TicketCreate = () => {
  const loggedInName =
    localStorage.getItem("name") ||
    JSON.parse(localStorage.getItem("user"))?.name ||
    "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    resourceName: "",
    preferredContact: "",
    contactName: "",
    reportedBy: loggedInName,
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setErrorMessage("You can upload up to 3 images only.");
      return;
    }

    setErrorMessage("");
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const createdTicket = await createTicket(formData, files);

      setSuccessMessage(
        `Ticket created successfully. Ticket Code: ${createdTicket.ticketCode}`
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        location: "",
        resourceName: "",
        preferredContact: "",
        contactName: "",
        reportedBy: loggedInName,
      });

      setFiles([]);
      e.target.reset();
    } catch (error) {
      console.error("Create ticket error:", error);
      console.error("Response data:", error?.response?.data);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-create-page">
      <div className="ticket-create-header">
        <h2 className="ticket-create-title">Create Incident Ticket</h2>
        <p className="ticket-create-subtitle">
          Submit a new issue with location, priority, and supporting details
        </p>
      </div>

      <div className="ticket-create-card">
        {successMessage && (
          <div className="ticket-create-alert ticket-create-alert-success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="ticket-create-alert ticket-create-alert-error">
            {errorMessage}
          </div>
        )}

        <form className="ticket-create-form" onSubmit={handleSubmit}>
          <div className="ticket-create-grid">
            <div className="ticket-create-field ticket-create-field-wide">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a short title for the incident"
                required
              />
            </div>

            <div className="ticket-create-field ticket-create-field-wide">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue clearly"
                rows="5"
                required
              />
            </div>

            <div className="ticket-create-field">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="IT_EQUIPMENT">IT Equipment</option>
                <option value="HVAC">HVAC</option>
                <option value="STRUCTURAL">Structural</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="SECURITY">Security</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="ticket-create-field">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="ticket-create-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter the issue location"
                required
              />
            </div>

            <div className="ticket-create-field">
              <label>Resource Name</label>
              <input
                type="text"
                name="resourceName"
                value={formData.resourceName}
                onChange={handleChange}
                placeholder="Optional resource or asset name"
              />
            </div>

            <div className="ticket-create-field">
              <label>Preferred Contact</label>
              <input
                type="text"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                placeholder="Email or phone"
                required
              />
            </div>

            <div className="ticket-create-field">
              <label>Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Optional contact name"
              />
            </div>

            <div className="ticket-create-field ticket-create-field-wide">
              <label>Reported By</label>
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                placeholder="Reporter name"
                required
                readOnly
              />
            </div>

            <div className="ticket-create-field ticket-create-field-wide">
              <label>Upload Images (max 3)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <span className="ticket-create-helper-text">
                Attach up to 3 images related to the issue
              </span>
            </div>
          </div>

          <div className="ticket-create-actions">
            <button
              className="ticket-create-primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCreate;