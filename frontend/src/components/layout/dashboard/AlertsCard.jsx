export default function AlertsCard({ notifications = [] }) {

    return (
      <div className="card alert-card">
        <div className="card-header">
          <h3>Notifications</h3>
        </div>
  
        {notifications.length === 0 ? (
          <p className="no-alerts">No new alerts</p>
        ) : (
          notifications.slice(0, 5).map((n, index) => (
            <div key={index} className={`alert-item ${n.read ? "" : "unread"}`}>
              <p>{n.message}</p>
              <span>{n.time}</span>
            </div>
          ))
        )}
      </div>
    );
  }