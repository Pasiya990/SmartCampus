import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const load = () => getMyBookings().then(r => setBookings(r.data));
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    load();
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>My Bookings</h2>
      {bookings.length === 0 && <p style={{ color: '#6B7280' }}>No bookings yet.</p>}
      {bookings.map(b => (
        <div key={b.id} style={{
          border: '1px solid #E5E7EB', borderRadius: 12,
          padding: 16, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{b.resourceName}</h3>
            <StatusBadge status={b.status} />
          </div>
          <p style={{ margin: '8px 0', color: '#374151' }}>
            {b.date} · {b.startTime} – {b.endTime}
          </p>
          <p style={{ margin: '4px 0', color: '#6B7280', fontSize: 13 }}>Purpose: {b.purpose}</p>
          {b.rejectionReason && (
            <p style={{ color: '#991B1B', fontSize: 13 }}>Reason: {b.rejectionReason}</p>
          )}
          {(b.status === 'PENDING' || b.status === 'APPROVED') && (
            <button onClick={() => handleCancel(b.id)} style={{
              marginTop: 8, padding: '6px 14px', background: '#FEE2E2',
              color: '#991B1B', border: 'none', borderRadius: 6, cursor: 'pointer'
            }}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}