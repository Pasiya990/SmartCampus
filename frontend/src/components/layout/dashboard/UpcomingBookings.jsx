export default function UpcomingBookings({ bookings }) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Upcoming Bookings</h3>
          <a href="/my-bookings">View</a>
        </div>
  
        {bookings.length === 0 ? (
          <p>No upcoming bookings</p>
        ) : (
          bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="ticket">
              <div>
                <strong>{b.resourceName}</strong>
                <p>{b.date} | {b.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }