import React, { useState } from "react";
import { createTicket } from "../../api/ticketApi";
import "./TicketCreate.css";

const TicketCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    resourceName: "",
    preferredContact: "",
    contactName: "",
    reportedBy: "",
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
        reportedBy: "",
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
      <div className="ticket-create-card">
        <h2 className="ticket-create-title">Create New Ticket</h2>

        {successMessage && (
          <p className="ticket-create-success">{successMessage}</p>
        )}

        {errorMessage && (
          <p className="ticket-create-error">{errorMessage}</p>
        )}

        <form className="ticket-create-form" onSubmit={handleSubmit}>
          <div className="ticket-create-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-create-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-create-row">
            <div className="ticket-create-group">
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

            <div className="ticket-create-group">
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
          </div>

          <div className="ticket-create-row">
            <div className="ticket-create-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ticket-create-group">
              <label>Resource Name</label>
              <input
                type="text"
                name="resourceName"
                value={formData.resourceName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ticket-create-row">
            <div className="ticket-create-group">
              <label>Preferred Contact</label>
              <input
                type="text"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ticket-create-group">
              <label>Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ticket-create-group">
            <label>Reported By</label>
            <input
              type="text"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ticket-create-group">
            <label>Upload Images (max 3)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <button
            className="ticket-create-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketCreate;