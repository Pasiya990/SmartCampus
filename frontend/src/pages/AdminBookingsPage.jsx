import { useEffect, useState } from 'react';
import { getAllBookings, approveBooking, rejectBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');

  const load = () => getAllBookings(filter || null).then(r => setBookings(r.data));
  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id) => {
    await approveBooking(id);
    load();
  };

  const handleReject = async () => {
    await rejectBooking(rejectId, reason);
    setRejectId(null); setReason('');
    load();
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>All Bookings (Admin)</h2>

      <select value={filter} onChange={e => setFilter(e.target.value)}
        style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #D1D5DB', marginBottom: 20 }}>
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {bookings.map(b => (
        <div key={b.id} style={{
          border: '1px solid #E5E7EB', borderRadius: 12,
          padding: 16, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{b.resourceName}</strong>
              <span style={{ marginLeft: 12, color: '#6B7280', fontSize: 13 }}>{b.userEmail}</span>
            </div>
            <StatusBadge status={b.status} />
          </div>
          <p style={{ margin: '8px 0', color: '#374151' }}>
            {b.date} · {b.startTime} – {b.endTime}
          </p>
          <p style={{ margin: 0, color: '#6B7280', fontSize: 13 }}>
            Purpose: {b.purpose} · Attendees: {b.attendees}
          </p>

          {b.status === 'PENDING' && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button onClick={() => handleApprove(b.id)} style={{
                padding: '6px 16px', background: '#D1FAE5', color: '#065F46',
                border: 'none', borderRadius: 6, cursor: 'pointer'
              }}>Approve</button>
              <button onClick={() => setRejectId(b.id)} style={{
                padding: '6px 16px', background: '#FEE2E2', color: '#991B1B',
                border: 'none', borderRadius: 6, cursor: 'pointer'
              }}>Reject</button>
            </div>
          )}
        </div>
      ))}

      {/* Reject modal */}
      {rejectId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 360 }}>
            <h3 style={{ marginBottom: 12 }}>Reason for Rejection</h3>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              rows={3} placeholder="Enter reason..."
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleReject} style={{
                flex: 1, padding: '8px', background: '#EF4444', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer'
              }}>Confirm Reject</button>
              <button onClick={() => setRejectId(null)} style={{
                flex: 1, padding: '8px', background: '#F3F4F6',
                border: 'none', borderRadius: 8, cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}