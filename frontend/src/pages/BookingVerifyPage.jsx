import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookingVerifyPage.css';

export default function BookingVerifyPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://10.175.71.110:8080/api/bookings/${id}`)
      .then(res => setBooking(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="verify-center">
      <p>Loading booking details...</p>
    </div>
  );

  if (!booking) return (
    <div className="verify-center">
      <p>❌ Booking not found</p>
    </div>
  );

  return (
    <div className="verify-page">
      <div className="verify-card">

        {/* Header */}
        <div className="verify-header">
          <div className="verify-checkmark">✓</div>
          <h1 className="verify-title">Booking Confirmed</h1>
          <p className="verify-subtitle">SmartCampus Resource Booking</p>
        </div>

        {/* Details */}
        <div className="verify-details">
          <Row icon="🏛️" label="Resource"  value={booking.resourceName} />
          <Row icon="📅" label="Date"      value={booking.date} />
          <Row icon="🕐" label="Time"      value={`${booking.startTime} – ${booking.endTime}`} />
          <Row icon="🎯" label="Purpose"   value={booking.purpose} />
          <Row icon="👥" label="Attendees" value={booking.attendees} />
          <Row icon="📧" label="Booked by" value={booking.userEmail} />
        </div>

        {/* Status Badge */}
        <div className="verify-status-wrap">
          <span className="verify-status-badge">✅ APPROVED</span>
        </div>

        <p className="verify-footer">Booking ID: #{booking.id}</p>

      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="verify-row">
      <span className="verify-row-icon">{icon}</span>
      <span className="verify-row-label">{label}</span>
      <span className="verify-row-value">{value}</span>
    </div>
  );
}