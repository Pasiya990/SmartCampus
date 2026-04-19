import { useState } from "react";
import { resourceService } from "../services/resourceService";
import toast from "react-hot-toast";
import "./ResourceModal.css";

const DEFAULT_TYPES = [
  "LECTURE_HALL",
  "LAB",
  "MEETING_ROOM",
  "EQUIPMENT",
  "SMART_RESOURCE",
  "OUTDOOR_EVENT_SPACE",
  "AUDITORIUM_STAGE",
  "LIBRARY_STUDY_AREA",
  "PODCAST_RECORDING_ROOM",
  "MEDIA_PRODUCTION_STUDIO",
];

const EMPTY = {
  name: "",
  type: "LECTURE_HALL",
  capacity: "",
  location: "",
  building: "",
  floor: "",
  description: "",
  availabilityStart: "",
  availabilityEnd: "",
  image: null,
};

export default function ResourceModal({ resource, types, onClose, onSaved }) {
  const [form, setForm] = useState(
    resource
      ? {
          ...resource,
          capacity: resource.capacity ?? "",
          availabilityStart: resource.availabilityStart ?? "",
          availabilityEnd: resource.availabilityEnd ?? "",
          image: null,
        }
      : EMPTY
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(resource?.imageUrl || "");

  const allTypes = types.length ? types : DEFAULT_TYPES;

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (form.capacity && Number(form.capacity) < 1) {
      e.capacity = "Capacity must be at least 1";
    }

    return e;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm((s) => ({ ...s, image: file }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(resource?.imageUrl || "");
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
      };

      if (resource) {
        await resourceService.update(resource.id, payload);
        toast.success("Resource updated!");
      } else {
        await resourceService.create(payload);
        toast.success("Resource created!");
      }

      onSaved();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      setErrors((s) => ({ ...s, [key]: "" }));
    },
  });

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-glass">
        <div className="modal-header">
          <h2>{resource ? "Edit Resource" : "Add New Resource"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <div className="field">
              <label>Name *</label>
              <input
                className={`glass-input ${errors.name ? "error" : ""}`}
                placeholder="e.g. Smart Classroom 01"
                {...fieldProps("name")}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label>Type *</label>
              <select className="glass-select" {...fieldProps("type")}>
                {allTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Location *</label>
              <input
                className={`glass-input ${errors.location ? "error" : ""}`}
                placeholder="Block A / Open Grounds / Library Wing"
                {...fieldProps("location")}
              />
              {errors.location && (
                <span className="field-error">{errors.location}</span>
              )}
            </div>

            <div className="field">
              <label>Capacity</label>
              <input
                className={`glass-input ${errors.capacity ? "error" : ""}`}
                type="number"
                min="1"
                placeholder="20"
                {...fieldProps("capacity")}
              />
              {errors.capacity && (
                <span className="field-error">{errors.capacity}</span>
              )}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Building</label>
              <input
                className="glass-input"
                placeholder="Main Building / Media Center"
                {...fieldProps("building")}
              />
            </div>

            <div className="field">
              <label>Floor</label>
              <input
                className="glass-input"
                placeholder="Ground / 1st / 2nd"
                {...fieldProps("floor")}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Available from</label>
              <input
                className="glass-input"
                type="time"
                {...fieldProps("availabilityStart")}
              />
            </div>

            <div className="field">
              <label>Available until</label>
              <input
                className="glass-input"
                type="time"
                {...fieldProps("availabilityEnd")}
              />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              className="glass-input"
              rows={3}
              placeholder="Optional details about the resource..."
              {...fieldProps("description")}
            />
          </div>

          <div className="field">
            <label>Resource Image</label>
            <input
              className="glass-input"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <div className="field">
              <label>Preview</label>
              <img
                src={preview}
                alt="Preview"
                className="modal-image-preview"
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : resource ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}