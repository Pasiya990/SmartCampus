import { useState, useEffect } from 'react';
import { createBooking, checkAvailability } from '../api/bookingApi';
import axios from 'axios';
import './BookingFormPage.css';
import { useParams, useLocation } from 'react-router-dom';

export default function BookingFormPage() {
  const { id: resourceId } = useParams();
  const location = useLocation();
  const passedResource = location.state?.resource;
  
  const today = new Date().toISOString().split('T')[0];
  
  const getNowTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const [resource, setResource] = useState(passedResource || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    resourceId: resourceId ? Number(resourceId) : null,
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1,
  });

  const [availability, setAvailability] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    if (resourceId) {
      setForm(prev => ({
        ...prev,
        resourceId: Number(resourceId)
      }));
    }
  }, [resourceId]);

  useEffect(() => {
    if (!resource && resourceId) {
      axios.get(`http://localhost:8080/api/resources/${resourceId}`)
        .then(res => setResource(res.data))
        .catch(() => setResource(null));
    }
  }, [resourceId, resource]);

  useEffect(() => {
    if (form.resourceId && form.date && form.startTime && form.endTime) {
      setIsCheckingAvailability(true);
      checkAvailability({
        resourceId: form.resourceId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime
      })
      .then(res => setAvailability(res.data))
      .catch(() => setAvailability(null))
      .finally(() => setIsCheckingAvailability(false));
    } else {
      setAvailability(null);
    }
  }, [form.resourceId, form.date, form.startTime, form.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (message || error) {
      setMessage('');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setMessage('');
    
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time");
      return;
    }
    
    if (availability === false) {
      setError("Selected time slot is unavailable");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createBooking({
        ...form,
        resourceId: Number(form.resourceId),
        attendees: Number(form.attendees),
      });
      
      setMessage('Booking request submitted successfully!');
      
      setForm({
        resourceId: Number(resourceId),
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
      });
      
      setAvailability(null);
      
      setTimeout(() => {
        setMessage('');
      }, 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bf-page">
      <div className="bf-container">
        {/* Header Section */}
        <div className="bf-header-section">
          <h1>Book Resource</h1>
          <p>Schedule your meeting room or equipment</p>
        </div>

        {/* Booking Form */}
        <div className="bf-card">
          <div className="bf-card-header">
            <h2>Booking Details</h2>
            <p>Fill in the information below</p>
          </div>
          
          <div className="bf-card-body">
            {message && <div className="bf-success">{message}</div>}
            {error && <div className="bf-error">{error}</div>}
            
            {resource && (
              <div className="bf-selected-resource">
                <div className="bf-resource-name">{resource.name}</div>
                <div className="bf-resource-details">
                  <span>📍 {resource.location}</span>
                  {resource.capacity && <span>👥 Capacity: {resource.capacity}</span>}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="bf-form-group">
                <label className="bf-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  min={today}
                  className="bf-input"
                />
              </div>
              
              <div className="bf-time-grid">
                <div className="bf-form-group">
                  <label className="bf-label">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    min={form.date === today ? getNowTime() : '00:00'}
                    className="bf-input"
                  />
                </div>
                
                <div className="bf-form-group">
                  <label className="bf-label">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    min={form.startTime || (form.date === today ? getNowTime() : '00:00')}
                    className="bf-input"
                  />
                </div>
              </div>
              
              {isCheckingAvailability && (
                <div className="bf-availability checking">
                  🔍 Checking availability...
                </div>
              )}
              
              {availability !== null && !isCheckingAvailability && (
                <div className={`bf-availability ${availability ? 'available' : 'unavailable'}`}>
                  {availability ? '✓ Slot Available - You can book this time' : '✗ Slot Unavailable - Please choose another time'}
                </div>
              )}
              
              <div className="bf-form-group">
                <label className="bf-label">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Team Meeting, Client Presentation"
                  className="bf-input"
                />
              </div>
              
              <div className="bf-form-group">
                <label className="bf-label">Number of Attendees</label>
                <input
                  type="number"
                  name="attendees"
                  value={form.attendees}
                  onChange={handleChange}
                  min="1"
                  max={resource?.capacity || 50}
                  className="bf-input"
                />
              </div>
              
              <button
                type="submit"
                className={`bf-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={availability === false || isSubmitting || !form.date || !form.startTime || !form.endTime}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}