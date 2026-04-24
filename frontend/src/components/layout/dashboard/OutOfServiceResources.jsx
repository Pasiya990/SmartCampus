import "./OutOfServiceResources.css";

export default function OutOfServiceResources({ resources }) {
  return (
    <div className="card outage-card">

      <div className="card-header">
        <h3>Out of Service</h3>
        <span className="outage-count">{resources.length}</span>
      </div>

      {resources.length === 0 ? (
        <p className="no-outage">All resources available ✅</p>
      ) : (
        resources.map((r) => (
          <div key={r.id} className="outage-item">

            <div className="outage-left">
              <div className="outage-icon">⚠️</div>

              <div>
                <p className="outage-name">{r.name}</p>
                <span className="outage-location">
                  {r.location || "Unknown location"}
                </span>
              </div>
            </div>

            <span className="outage-status">
              {r.status === "MAINTENANCE"
                ? "Maintenance"
                : "Out of Service"}
            </span>

          </div>
        ))
      )}
    </div>
  );
}