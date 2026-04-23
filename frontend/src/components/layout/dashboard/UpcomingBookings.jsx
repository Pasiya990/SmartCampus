import "./UpcomingBookings.css";

export default function UpcomingBookings({ bookings }) {

  const formatDate = (date) => {
    const d = new Date(date);

    return {
      day: d.getDate(),
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase()
    };
  };

  return (
    <div className="bookings-card">
      
      {/* HEADER */}
      <div className="bookings-header">
        <h3>Upcoming Bookings</h3>
        <a href="/my-bookings">...</a>
      </div>

      {/* CONTENT */}
      {bookings.length === 0 ? (
        <p className="empty">No upcoming bookings</p>
      ) : (
        bookings.slice(0, 3).map((b) => {
          const { day, month } = formatDate(b.date);

          return (
            <div key={b.id} className="booking-item">

              {/* DATE BOX */}
              <div className="booking-date">
                <span className="month">{month}</span>
                <span className="day">{day}</span>
              </div>

              {/* DETAILS */}
              <div className="booking-details">
                <h4>{b.resourceName}</h4>
                <p>{b.time}</p>
              </div>

            </div>
          );
        })
      )}

    </div>
  );
}