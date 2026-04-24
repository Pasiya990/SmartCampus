import "./UpcomingBookings.css";

export default function UpcomingBookings({ bookings }) {
  const formatDate = (date) => {
    const d = new Date(date);
    return {
      day: d.getDate(),
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    };
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":");
    const d = new Date();
    d.setHours(+h, +m);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div className="bookings-card">
      {/* HEADER */}
      <div className="bookings-header">
        <h3>Upcoming Bookings</h3>
        <a href="/my-bookings">···</a>
      </div>

      {/* CONTENT */}
      {bookings.length === 0 ? (
        <p className="empty">No upcoming bookings</p>
      ) : (
        bookings.slice(0, 3).map((b) => {
          const { day, month } = formatDate(b.date);
          const status = b.status?.toLowerCase();

          return (
            <div key={b.id} className="booking-item">
              {/* DATE BOX */}
              <div className="booking-date">
                <span className="month">{month}</span>
                <span className="day">{day}</span>
              </div>

              {/* DETAILS */}
              <div className="booking-details">
                <div className="booking-top">
                  <h4>{b.resourceName}</h4>
                  <span className={`booking-status ${status}`}>
                    {b.status}
                  </span>
                </div>
                <p className="booking-time">
                  🕐 {formatTime(b.startTime)} – {formatTime(b.endTime)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}