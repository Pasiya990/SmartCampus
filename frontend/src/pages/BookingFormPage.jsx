import { useState, useEffect } from 'react';
import { createBooking } from '../api/bookingApi';
import axios from 'axios';
import './BookingFormPage.css';

export default function BookingFormPage() {
  const today = new Date().toISOString().split('T')[0]; 

  const getNowTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5); 
};
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: '', date: '', startTime: '',
    endTime: '', purpose: '', attendees: 1,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/resources')
      .then(res => setResources(res.data))
      .catch(() => setResources([]));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await createBooking({
        ...form,
        resourceId: Number(form.resourceId),
        attendees: Number(form.attendees),
      });
      setMessage('Booking request submitted successfully!');
      setForm({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '', attendees: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking');
    }
  };

  return (
    <div className="bf-page">
      <div className="bf-card">
        <h2 className="bf-heading">Request a Booking</h2>
        <p className="bf-sub">Fill in the details to reserve a campus resource.</p>

        {message && <div className="bf-success">✓ {message}</div>}
        {error   && <div className="bf-error">✗ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="bf-label">Resource</label>
          <select name="resourceId" value={form.resourceId} onChange={handleChange} required className="bf-input">
            <option value="">Select a resource…</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>{r.name} — {r.location}</option>
            ))}
          </select>

          <label className="bf-label">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required min={today} className="bf-input" />

          <div className="bf-time-grid">
            <div>
              <label className="bf-label">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required min={form.date === today ? getNowTime() : '00:00'} className="bf-input" />
            </div>
            <div>
              <label className="bf-label">End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required min={form.startTime || (form.date === today ? getNowTime() : '00:00')} className="bf-input" />
            </div>
          </div>

          <label className="bf-label">Purpose</label>
          <input type="text" name="purpose" value={form.purpose} onChange={handleChange} required placeholder="e.g. Team meeting" className="bf-input" />

          <label className="bf-label">Expected Attendees</label>
          <input type="number" name="attendees" value={form.attendees} onChange={handleChange} min="1" className="bf-input" />

          <div className="bf-divider" />
          <button type="submit" className="bf-btn">Submit Booking Request →</button>
        </form>
      </div>
    </div>
  );
}