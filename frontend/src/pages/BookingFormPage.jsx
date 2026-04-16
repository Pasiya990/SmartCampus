import { useState, useEffect } from 'react';
import { createBooking } from '../api/bookingApi';
import axios from 'axios';

export default function BookingFormPage() {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const inputStyle = {
    width: '100%', padding: '8px 12px', marginBottom: 12,
    border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14,
  };
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 };

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 24, border: '1px solid #E5E7EB', borderRadius: 12 }}>
      <h2 style={{ marginBottom: 24 }}>Request a Booking</h2>

      {message && <div style={{ background: '#D1FAE5', color: '#065F46', padding: 10, borderRadius: 8, marginBottom: 12 }}>{message}</div>}
      {error   && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Resource</label>
        <select name="resourceId" value={form.resourceId} onChange={handleChange} required style={inputStyle}>
          <option value="">Select a resource...</option>
          {resources.map(r => (
            <option key={r.id} value={r.id}>{r.name} — {r.location}</option>
          ))}
        </select>

        <label style={labelStyle}>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Start Time</label>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>End Time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>Purpose</label>
        <input type="text" name="purpose" value={form.purpose} onChange={handleChange} required placeholder="e.g. Team meeting" style={inputStyle} />

        <label style={labelStyle}>Expected Attendees</label>
        <input type="number" name="attendees" value={form.attendees} onChange={handleChange} min="1" style={inputStyle} />

        <button type="submit" style={{
          width: '100%', padding: '10px', background: '#2563EB',
          color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer'
        }}>
          Submit Booking Request
        </button>
      </form>
    </div>
  );
}