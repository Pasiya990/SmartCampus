import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../api/ticketApi";
import { resourceService } from "../../services/resourceService";
import "./TicketCreate.css";

const getEmailFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return "";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch (e) {
    console.error("Invalid token", e);
    return "";
  }
};

const TicketCreate = () => {
  const loggedInEmail = getEmailFromToken();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    resourceId: "",
    resourceName: "",
    preferredContact: "",
    contactName: "",
    reportedBy: loggedInEmail,
  });

  const [resources, setResources] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const email = getEmailFromToken();
    setFormData((prev) => ({
      ...prev,
      reportedBy: email,
    }));
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await resourceService.getAvailable();
        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources", error);
      }
    };

    fetchResources();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setSuccessMessage("");

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuildingChange = (e) => {
    const building = e.target.value;
    setSelectedBuilding(building);
    setSelectedFloor("");

    setFormData((prev) => ({
      ...prev,
      resourceId: "",
      resourceName: "",
      location: "",
    }));
  };

  const handleFloorChange = (e) => {
    const floor = e.target.value;
    setSelectedFloor(floor);

    setFormData((prev) => ({
      ...prev,
      resourceId: "",
      resourceName: "",
      location: "",
    }));
  };

  const handleResourceChange = (e) => {
    const selectedId = e.target.value;

    const selectedResource = resources.find(
      (resource) => String(resource.id) === String(selectedId)
    );

    if (!selectedResource) {
      setFormData((prev) => ({
        ...prev,
        resourceId: "",
        resourceName: "",
        location: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      location: selectedResource.location || "",
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      showErrorMessage("You can upload up to 3 images only.");
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+94|0)?[0-9]{9}$/;

    if (
      !emailRegex.test(formData.preferredContact) &&
      !phoneRegex.test(formData.preferredContact)
    ) {
      showErrorMessage("Enter a valid email or phone number");
      setLoading(false);
      return;
    }

    if (!selectedBuilding || !selectedFloor || !formData.resourceId) {
      showErrorMessage("Please select building, floor, and resource");
      setLoading(false);
      return;
    }

    try {
      const createdTicket = await createTicket(formData, files);

      showSuccessMessage(
        `Ticket created successfully. Ticket Code: ${createdTicket.ticketCode}`
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        location: "",
        resourceId: "",
        resourceName: "",
        preferredContact: "",
        contactName: "",
        reportedBy: loggedInEmail,
      });

      setSelectedBuilding("");
      setSelectedFloor("");
      setResources(resources);
      setFiles([]);
      e.target.reset();
    } catch (error) {
      console.error("Create ticket error:", error);
      console.error("Response data:", error?.response?.data);

      showErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const uniqueBuildings = [
    ...new Set(
      resources
        .map((resource) => resource.building)
        .filter((building) => building && building.trim() !== "")
    ),
  ];

  const uniqueFloors = [
    ...new Set(
      resources
        .filter((resource) => resource.building === selectedBuilding)
        .map((resource) => resource.floor)
        .filter((floor) => floor && String(floor).trim() !== "")
    ),
  ];

  const filteredResources = resources.filter(
    (resource) =>
      resource.building === selectedBuilding &&
      String(resource.floor) === String(selectedFloor)
  );

  return (
    <div className="ticket-create-page">
      <div className="ticket-create-toast-container">
        {successMessage && (
          <div className="ticket-create-toast success">
            <span>✅</span>
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="ticket-create-toast error">
            <span>⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="ticket-create-header">
        <div className="ticket-create-header-left">
          <button
            type="button"
            className="ticket-create-back-btn"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <div>
            <h2 className="ticket-create-title">Create Incident Ticket</h2>
            <p className="ticket-create-subtitle">
              Submit a new issue with location, priority, and supporting details
            </p>
          </div>
        </div>
      </div>

      <div className="ticket-create-card">
        <form className="ticket-create-form" onSubmit={handleSubmit}>
          <div className="ticket-create-grid">
            <div className="ticket-create-field ticket-create-field-wide">
              <label>
                Title <span className="ticket-create-required">*</span>
              </label>
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
              <label>
                Description <span className="ticket-create-required">*</span>
              </label>
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
              <label>
                Category <span className="ticket-create-required">*</span>
              </label>
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
              <label>
                Priority <span className="ticket-create-required">*</span>
              </label>
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
              <label>
                Building <span className="ticket-create-required">*</span>
              </label>
              <select
                value={selectedBuilding}
                onChange={handleBuildingChange}
                required
              >
                <option value="">Select Building</option>
                {uniqueBuildings.map((building, index) => (
                  <option key={index} value={building}>
                    {building}
                  </option>
                ))}
              </select>
            </div>

            <div className="ticket-create-field">
              <label>
                Floor <span className="ticket-create-required">*</span>
              </label>
              <select
                value={selectedFloor}
                onChange={handleFloorChange}
                required
                disabled={!selectedBuilding}
              >
                <option value="">Select Floor</option>
                {uniqueFloors.map((floor, index) => (
                  <option key={index} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>

            <div className="ticket-create-field">
              <label>
                Resource Name <span className="ticket-create-required">*</span>
              </label>
              <select
                value={formData.resourceId}
                onChange={handleResourceChange}
                required
                disabled={!selectedBuilding || !selectedFloor}
              >
                <option value="">Select Resource</option>
                {filteredResources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ticket-create-field">
              <label>
                Location <span className="ticket-create-required">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="Auto-filled from selected resource"
                readOnly
                required
              />
            </div>

            <div className="ticket-create-field">
              <label>
                Preferred Contact{" "}
                <span className="ticket-create-required">*</span>
              </label>
              <input
                type="text"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                placeholder="Enter Email or valid phone number"
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
                placeholder="Reporter email"
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