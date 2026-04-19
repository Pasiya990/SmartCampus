import { useEffect, useState, useCallback } from 'react';
import { getAllBookings, approveBooking, rejectBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import './Bookings.css';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    getAllBookings(filter || null).then(r => setBookings(r.data));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => { 
    try {
      await approveBooking(id); 
      setMessage('✓ Booking approved successfully');
      load();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('✗ Failed to approve booking');
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const handleReject = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      await rejectBooking(rejectId, reason);
      setMessage('✓ Booking rejected successfully');
      setRejectId(null); 
      setReason(''); 
      load();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('✗ Failed to reject booking');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    approved: bookings.filter(b => b.status === 'APPROVED').length,
    rejected: bookings.filter(b => b.status === 'REJECTED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  // Handle stat card click
  const handleStatClick = (statusFilter) => {
    setFilter(statusFilter === 'total' ? '' : statusFilter);
  };

  return (
    <div className="bk-page">
      <div className="bk-header">
        <div>
          <h2 className="bk-title">All Bookings</h2>
          <p className="bk-sub">Review and manage booking requests across campus</p>
        </div>
        
        {/* Filter Dropdown */}
        <div className="bk-filter-container">
          <span className="bk-filter-label">
            <span className="bk-filter-icon">🔍</span>
            Filter by status
          </span>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="bk-filter-select"
          >
            <option value="">All statuses</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="APPROVED">✅ Approved</option>
            <option value="REJECTED">❌ Rejected</option>
            <option value="CANCELLED">🚫 Cancelled</option>
          </select>
          {filter && (
            <button className="bk-filter-clear" onClick={() => setFilter('')}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards - Clickable */}
      <div className="bk-stats">
        <div 
          className={`bk-stat-card ${filter === '' ? 'active' : ''}`}
          onClick={() => handleStatClick('total')}
        >
          <span className="bk-stat-label">Total</span>
          <span className="bk-stat-value">{stats.total}</span>
        </div>
        <div 
          className={`bk-stat-card pending-stat ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => handleStatClick('PENDING')}
        >
          <span className="bk-stat-label">Pending</span>
          <span className="bk-stat-value">{stats.pending}</span>
        </div>
        <div 
          className={`bk-stat-card approved-stat ${filter === 'APPROVED' ? 'active' : ''}`}
          onClick={() => handleStatClick('APPROVED')}
        >
          <span className="bk-stat-label">Approved</span>
          <span className="bk-stat-value">{stats.approved}</span>
        </div>
        <div 
          className={`bk-stat-card rejected-stat ${filter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => handleStatClick('REJECTED')}
        >
          <span className="bk-stat-label">Rejected</span>
          <span className="bk-stat-value">{stats.rejected}</span>
        </div>
        <div 
          className={`bk-stat-card cancelled-stat ${filter === 'CANCELLED' ? 'active' : ''}`}
          onClick={() => handleStatClick('CANCELLED')}
        >
          <span className="bk-stat-label">Cancelled</span>
          <span className="bk-stat-value">{stats.cancelled}</span>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {bookings.length === 0 && (
        <div className="bk-empty">
          <p>📭</p>
          <p>No bookings found</p>
          {filter && <p style={{ fontSize: '12px', marginTop: '8px', color: '#9ca3af' }}>
            Try changing the filter status
          </p>}
        </div>
      )}

      {/* Booking Cards */}
      {bookings.map(b => (
        <div key={b.id} className="card">
          <div className="card-top">
            <div>
              <h3 className="card-title">{b.resourceName}</h3>
              <div className="card-user">
                <span className="card-email">{b.userEmail}</span>
              </div>
            </div>
            <StatusBadge status={b.status} />
          </div>
          
          <div className="card-text">
            {b.date} · {b.startTime} – {b.endTime}
          </div>
          
          <div className="card-meta">
            <span>Purpose: {b.purpose}</span>
            <span>Attendees: {b.attendees}</span>
          </div>

          {b.status === 'REJECTED' && b.rejectionReason && (
            <div className="card-rejection">
              {b.rejectionReason}
            </div>
          )}

          {b.status === 'PENDING' && (
            <div className="card-actions">
              <button className="btn-approve" onClick={() => handleApprove(b.id)}>
                ✓ Approve
              </button>
              <button className="btn-reject" onClick={() => setRejectId(b.id)}>
                ✕ Reject
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Rejection Modal */}
      {rejectId && (
        <div className="modal-overlay" onClick={() => setRejectId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '28px' }}>
              <h3>Reject Booking</h3>
              <p>Provide a reason so the requester knows what happened</p>
              <textarea
                className="modal-textarea"
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={4}
                placeholder="Enter reason for rejection…"
                autoFocus
              />
              <div className="modal-actions">
                <button className="modal-btn-confirm" onClick={handleReject}>
                  Confirm Reject
                </button>
                <button className="modal-btn-cancel" onClick={() => setRejectId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}