export default function RecentTickets({ tickets }) {
    return (
      <div className="card large">
        <div className="card-header">
          <h3>Recent Tickets</h3>
          <a href="/my-tickets">View All</a>
        </div>
  
        {tickets.length === 0 ? (
          <p>No tickets</p>
        ) : (
          tickets.slice(0, 3).map((t) => (
            <div key={t.id} className="ticket">
              <div>
                <strong>{t.title}</strong>
                <p>{t.location}</p>
              </div>
  
              <span className={`status ${t.status?.toLowerCase()}`}>
                {t.status}
              </span>
            </div>
          ))
        )}
      </div>
    );
  }