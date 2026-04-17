import { useEffect, useState, useCallback } from 'react';
import { getAllBookings, approveBooking, rejectBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './Bookings.css';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');

  const load = useCallback(() => {
    getAllBookings(filter || null).then(r => setBookings(r.data));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => { await approveBooking(id); load(); };
  const handleReject  = async ()  => {
    await rejectBooking(rejectId, reason);
    setRejectId(null); setReason(''); load();
  };

  return (
    <div className="bk-page">
      <div className="bk-header">
        <div>
          <h2 className="bk-title">All Bookings</h2>
          <p className="bk-sub">Review and manage booking requests across campus.</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bk-filter">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {bookings.length === 0 && <div className="bk-empty">No bookings found.</div>}

      {bookings.map(b => (
        <div key={b.id} className="card">
          <div className="card-top">
            <div>
              <h3 className="card-title">{b.resourceName}</h3>
              <span className="card-email">{b.userEmail}</span>
            </div>
            <StatusBadge status={b.status} />
          </div>
          <p className="card-text">📅 {b.date} &nbsp;·&nbsp; 🕐 {b.startTime} – {b.endTime}</p>
          <p className="card-meta">Purpose: {b.purpose} &nbsp;·&nbsp; Attendees: {b.attendees}</p>

          {b.status === 'PENDING' && (
            <div className="card-actions">
              <button className="btn-approve" onClick={() => handleApprove(b.id)}>✓ Approve</button>
              <button className="btn-reject"  onClick={() => setRejectId(b.id)}>✕ Reject</button>
            </div>
          )}
        </div>
      ))}

      {rejectId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reject Booking</h3>
            <p>Provide a reason so the requester knows what happened.</p>
            <textarea
              className="modal-textarea"
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Enter reason for rejection…"
            />
            <div className="modal-actions">
              <button className="modal-btn-confirm" onClick={handleReject}>Confirm Reject</button>
              <button className="modal-btn-cancel"  onClick={() => setRejectId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}