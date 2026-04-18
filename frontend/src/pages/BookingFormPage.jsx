import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createBooking, checkAvailability } from '../api/bookingApi';
import axios from 'axios';
import './BookingFormPage.css';

export default function BookingFormPage() {

  const { resourceId } = useParams(); 

  const today = new Date().toISOString().split('T')[0]; 

  const getNowTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); 
  };

  const [resource, setResource] = useState(null);

  const [form, setForm] = useState({
    resourceId: resourceId,
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1,
  });

  const [availability, setAvailability] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  
  useEffect(() => {
    axios.get(`http://localhost:8080/api/resources/${resourceId}`)
      .then(res => setResource(res.data))
      .catch(() => setResource(null));
  }, [resourceId]);

  
  useEffect(() => {
    if (form.resourceId && form.date && form.startTime && form.endTime) {

      checkAvailability({
        resourceId: form.resourceId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime
      })
      .then(res => setAvailability(res.data))
      .catch(() => setAvailability(null));

    } else {
      setAvailability(null);
    }
  }, [form.resourceId, form.date, form.startTime, form.endTime]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (availability === false) {
      setError("Selected time slot is unavailable");
      return;
    }

    try {
      await createBooking({
        ...form,
        resourceId: Number(form.resourceId),
        attendees: Number(form.attendees),
      });

      setMessage('Booking request submitted successfully!');
      setForm({
        resourceId,
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking');
    }
  };

  return (
    <div className="bf-page">
      <div className="bf-card">

        <h2 className="bf-heading">Book Resource</h2>

        
        {resource && (
          <div className="bf-selected-resource">
            <strong>{resource.name}</strong> — {resource.location}
          </div>
        )}

        {message && <div className="bf-success">✓ {message}</div>}
        {error && <div className="bf-error">✗ {error}</div>}

        <form onSubmit={handleSubmit}>

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

          <div className="bf-time-grid">
            <div>
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

            <div>
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

          
          {availability !== null && (
            <div className={availability ? "bf-success" : "bf-error"}>
              {availability ? "✓ Slot Available" : "✗ Slot Unavailable"}
            </div>
          )}

          <label className="bf-label">Purpose</label>
          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            className="bf-input"
          />

          <label className="bf-label">Attendees</label>
          <input
            type="number"
            name="attendees"
            value={form.attendees}
            onChange={handleChange}
            min="1"
            className="bf-input"
          />

          <button
            type="submit"
            className="bf-btn"
            disabled={availability === false}
          >
            Submit Booking →
          </button>

        </form>
      </div>
    </div>
  );
}