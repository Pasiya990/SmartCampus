import { useEffect, useState } from 'react';
import {getMyBookings,cancelBooking,deleteOwnBooking,editBooking} from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './Bookings.css';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [filter, setFilter] = useState('ALL');
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1,
  });

  useEffect(() => {
    setLoading(true);
    getMyBookings()
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [refresh]);

  const isUpcoming = (b) => {
    const dt = new Date(`${b.date}T${b.startTime}`);
    return dt > new Date();
  };

  // FILTERS
  const filteredBookings = bookings.filter(b => {
    switch (filter) {
      case 'UPCOMING':
        return isUpcoming(b) && b.status !== 'REJECTED' && b.status !== 'CANCELLED';
      case 'PENDING':
        return b.status === 'PENDING';
      case 'REJECTED':
        return b.status === 'REJECTED';
      case 'CANCELLED':
        return b.status === 'CANCELLED';
      default:
        return true;
    }
  });

  // COUNTS
  const getCount = (type) => {
    switch (type) {
      case 'ALL': return bookings.length;
      case 'UPCOMING':
        return bookings.filter(b =>
          isUpcoming(b) &&
          b.status !== 'REJECTED' &&
          b.status !== 'CANCELLED'
        ).length;
      case 'PENDING': return bookings.filter(b => b.status === 'PENDING').length;
      case 'REJECTED': return bookings.filter(b => b.status === 'REJECTED').length;
      case 'CANCELLED': return bookings.filter(b => b.status === 'CANCELLED').length;
      default: return 0;
    }
  };

  // ACTIONS
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setMessage('Booking cancelled');
      setRefresh(r => r + 1);
    } catch {
      setError('Cancel failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete booking?')) return;
    try {
      await deleteOwnBooking(id);
      setMessage('Deleted successfully');
      setRefresh(r => r + 1);
    } catch {
      setError('Delete failed');
    }
  };

  
  const handleEditOpen = (b) => {
    setEditingId(b.id);
    setEditForm({
      resourceId: b.resourceId,
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
      purpose: b.purpose,
      attendees: b.attendees,
    });
  };

  const handleEditSubmit = async () => {
    try {
      await editBooking(editingId, {
        ...editForm,
        resourceId: Number(editForm.resourceId),
        attendees: Number(editForm.attendees),
      });

      setMessage('Updated successfully (PENDING again)');
      setEditingId(null);
      setRefresh(r => r + 1);

    } catch {
      setError('Update failed');
    }
  };

  return (
    <div className="bk-page my-bookings-page">

      {/* HEADER */}
      <div className="bk-header">
        <div>
          <h2 className="bk-title">My Bookings</h2>
          <p className="bk-sub">Track and manage your bookings</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="bk-filter-bar">
        <div className="bk-filter-tabs">

          <button className={`bk-filter-tab ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
            All <span className="filter-count">{getCount('ALL')}</span>
          </button>

          <button className={`bk-filter-tab ${filter === 'UPCOMING' ? 'active' : ''}`} onClick={() => setFilter('UPCOMING')}>
            Upcoming <span className="filter-count">{getCount('UPCOMING')}</span>
          </button>

          <button className={`bk-filter-tab ${filter === 'PENDING' ? 'active' : ''}`} onClick={() => setFilter('PENDING')}>
            Pending <span className="filter-count">{getCount('PENDING')}</span>
          </button>

          <button className={`bk-filter-tab ${filter === 'REJECTED' ? 'active' : ''}`} onClick={() => setFilter('REJECTED')}>
            Rejected <span className="filter-count">{getCount('REJECTED')}</span>
          </button>

          <button className={`bk-filter-tab ${filter === 'CANCELLED' ? 'active' : ''}`} onClick={() => setFilter('CANCELLED')}>
            Cancelled <span className="filter-count">{getCount('CANCELLED')}</span>
          </button>

        </div>
      </div>

      {/* MESSAGES */}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {/* CONTENT */}
      {loading ? (
        <div className="skeleton-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bk-empty">
          <p>📭</p>
          <p>No bookings found</p>
        </div>
      ) : (
        filteredBookings.map(b => (
          <div key={b.id} className="card">

            <div className="card-top">
              <h3 className="card-title">{b.resourceName}</h3>
              <StatusBadge status={b.status} />
            </div>

            <div className="card-text">
              {b.date} · {b.startTime} – {b.endTime}
            </div>

            <div className="card-meta">
              <span>🎯 {b.purpose}</span>
              <span>👥 {b.attendees}</span>
            </div>

            {b.rejectionReason && (
              <div className="card-rejection">
                {b.rejectionReason}
              </div>
            )}

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
                <button className="btn-reject" onClick={() => handleDelete(b.id)}>
                  Delete
                </button>
              )}

            </div>
          </div>
        ))
      )}

      {/* MODAL */}
      {editingId && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h3>Edit Booking</h3>

            <input type="date" value={editForm.date}
              onChange={e => setEditForm({ ...editForm, date: e.target.value })} />

            <input type="time" value={editForm.startTime}
              onChange={e => setEditForm({ ...editForm, startTime: e.target.value })} />

            <input type="time" value={editForm.endTime}
              onChange={e => setEditForm({ ...editForm, endTime: e.target.value })} />

            <input type="text" value={editForm.purpose}
              onChange={e => setEditForm({ ...editForm, purpose: e.target.value })} />

            <input type="number" value={editForm.attendees}
              onChange={e => setEditForm({ ...editForm, attendees: e.target.value })} />

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