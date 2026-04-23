export default function DashboardHero({ name, stats }) {
    return (
      <div className="hero">
        <div>
          <h2>Welcome back, {name}</h2>
          <p>Manage your tickets, bookings, and campus resources</p>
        </div>
  
        <div className="stats">
          <div>
            <span>My Tickets</span>
            <h3>{stats.active}</h3>
          </div>
  
          <div>
            <span>Pending</span>
            <h3>{stats.pending}</h3>
          </div>
  
          <div>
            <span>Bookings</span>
            <h3>{stats.bookings}</h3>
          </div>
        </div>
      </div>
    );
  }