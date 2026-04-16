import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking, deleteOwnBooking, editBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './Bookings.css';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    resourceId: '', date: '', startTime: '',
    endTime: '', purpose: '', attendees: 1,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = () => getMyBookings().then(r => setBookings(r.data));
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    load();
  };

  const handleDelete = async (id) => {
    console.log("DELETE CLICKED:", id);

    if (!window.confirm('Delete this booking permanently?')) return;

    try {
      const res = await deleteOwnBooking(id);

      console.log("STATUS:", res.status);
      console.log("DATA:", res.data);

      setBookings(prev => prev.filter(b => b.id !== id));
      setMessage('Booking deleted successfully');

    } catch (err) {
      console.error("DELETE ERROR:", err.response || err);
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  const handleEditOpen = (b) => {
    setEditingId(b.id);
    setEditForm({ ...b });
    setError('');
    setMessage('');
  };

  const handleEditSubmit = async () => {
    try {
      await editBooking(editingId, {
        ...editForm,
        resourceId: Number(editForm.resourceId),
        attendees: Number(editForm.attendees),
      });
      setMessage('Booking updated! Status reset to PENDING.');
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  return (
    <div className="bk-page">

      {/* Header */}
      <div className="bk-header">
        <div>
          <h2 className="bk-title">My Bookings</h2>
          <p className="bk-sub">Track and manage your bookings.</p>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {bookings.length === 0 && (
        <div className="bk-empty">You haven't made any bookings yet.</div>
      )}

      {/* Cards */}
      {bookings.map(b => (
        <div key={b.id} className="card">

          <div className="card-top">
            <h3 className="card-title">{b.resourceName}</h3>
            <StatusBadge status={b.status} />
          </div>

          <p className="card-text">
            📅 {b.date} · 🕐 {b.startTime} – {b.endTime}
          </p>

          <p className="card-meta">
            Purpose: {b.purpose} · Attendees: {b.attendees}
          </p>

          {b.rejectionReason && (
            <span className="card-rejection">⚠ {b.rejectionReason}</span>
          )}

          {/* Actions */}
          <div className="card-actions">

            {(b.status === 'PENDING' || b.status === 'APPROVED') && (
              <button className="btn-cancel" onClick={() => handleCancel(b.id)}>
                Cancel
              </button>
            )}

            {b.status === 'PENDING' && (
              <button className="btn-approve" onClick={() => handleEditOpen(b)}>
                Edit
              </button>
            )}

            {(b.status === 'CANCELLED' || b.status === 'REJECTED') && (
              <button
                className="btn-reject"
                onClick={() => {
                  alert("CLICK WORKING"); // 👈 ADD THIS
                  console.log("DELETE CLICKED:", b.id);
                  handleDelete(b.id);
                }}
              >
                Delete
              </button>
            )}

          </div>
        </div>
      ))}

      
      {editingId && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>Edit Booking</h3>
            <p>After editing, status will reset to pending.</p>

            <input
              type="date"
              value={editForm.date}
              onChange={e => setEditForm({ ...editForm, date: e.target.value })}
              className="modal-textarea"
            />

            
            <div className="time-grid">
              <div>
                <input
                  type="time"
                  value={editForm.startTime}
                  onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                  className="modal-textarea"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={editForm.endTime}
                  onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                  className="modal-textarea"
                />
              </div>
            </div>

            <input
              type="text"
              value={editForm.purpose}
              onChange={e => setEditForm({ ...editForm, purpose: e.target.value })}
              className="modal-textarea"
              placeholder="Purpose"
            />

            <input
              type="number"
              value={editForm.attendees}
              min="1"
              onChange={e => setEditForm({ ...editForm, attendees: e.target.value })}
              className="modal-textarea"
            />

            <div className="modal-actions">
              <button className="modal-btn-confirm" onClick={handleEditSubmit}>
                Save
              </button>
              <button className="modal-btn-cancel" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}