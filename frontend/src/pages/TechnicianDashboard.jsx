import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTicketsByAssignedTechnician } from "../api/ticketApi";
import TechnicianLayout from "../components/TechnicianLayout";
import "./TechnicianDashboard.css";

export default function TechnicianDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  let technicianEmail = "";
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      technicianEmail = payload.sub || payload.email || "";
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        const data = await getTicketsByAssignedTechnician();
        setTickets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching technician tickets:", error);
        setErrorMessage("Failed to load technician dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTickets();
  }, []);

  const analytics = useMemo(() => {
    const safeTickets = Array.isArray(tickets) ? tickets : [];

    const total = safeTickets.length;

    const open = safeTickets.filter((t) => t.status === "OPEN").length;
    const inProgress = safeTickets.filter(
      (t) => t.status === "IN_PROGRESS"
    ).length;
    const resolved = safeTickets.filter((t) => t.status === "RESOLVED").length;
    const closed = safeTickets.filter((t) => t.status === "CLOSED").length;

    const high = safeTickets.filter((t) => t.priority === "HIGH").length;
    const medium = safeTickets.filter((t) => t.priority === "MEDIUM").length;
    const low = safeTickets.filter((t) => t.priority === "LOW").length;

    const priorityItems = [
      { label: "High", value: high },
      { label: "Medium", value: medium },
      { label: "Low", value: low },
    ];

    const maxPriority = Math.max(...priorityItems.map((item) => item.value), 1);

    const totalStatus = open + inProgress + resolved + closed;
    const safeTotalStatus = totalStatus || 1;

    const openPercent = (open / safeTotalStatus) * 100;
    const inProgressPercent = (inProgress / safeTotalStatus) * 100;
    const resolvedPercent = (resolved / safeTotalStatus) * 100;

    const doughnutStyle = {
      background: `conic-gradient(
        #7c67df 0% ${openPercent}%,
        #5bc07a ${openPercent}% ${openPercent + inProgressPercent}%,
        #f08a80 ${openPercent + inProgressPercent}% ${
        openPercent + inProgressPercent + resolvedPercent
      }%,
        #d7dbe6 ${openPercent + inProgressPercent + resolvedPercent}% 100%
      )`,
    };

    const recentTickets = [...safeTickets]
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt || a.createdAt || a.reportedAt || 0
        ).getTime();
        const dateB = new Date(
          b.updatedAt || b.createdAt || b.reportedAt || 0
        ).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    const statusLegend = [
      {
        label: "Open",
        value: open,
        percent: Math.round((open / safeTotalStatus) * 100),
        className: "techdash-dot-open",
      },
      {
        label: "In Progress",
        value: inProgress,
        percent: Math.round((inProgress / safeTotalStatus) * 100),
        className: "techdash-dot-progress",
      },
      {
        label: "Resolved",
        value: resolved,
        percent: Math.round((resolved / safeTotalStatus) * 100),
        className: "techdash-dot-resolved",
      },
      {
        label: "Closed",
        value: closed,
        percent: Math.round((closed / safeTotalStatus) * 100),
        className: "techdash-dot-closed",
      },
    ];

    const latestHighPriority = recentTickets.filter(
      (ticket) => ticket.priority === "HIGH"
    ).length;

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      high,
      medium,
      low,
      priorityItems,
      maxPriority,
      totalStatus,
      doughnutStyle,
      recentTickets,
      statusLegend,
      latestHighPriority,
    };
  }, [tickets]);

  if (loading) {
    return (
      <TechnicianLayout activeMenu="dashboard">
        <p className="techdash-loading">Loading dashboard...</p>
      </TechnicianLayout>
    );
  }

  if (errorMessage) {
    return (
      <TechnicianLayout activeMenu="dashboard">
        <p className="techdash-error">{errorMessage}</p>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout activeMenu="dashboard">
      <div className="techdash-page">
        <div className="techdash-header">
          <div>
            <h1 className="techdash-title">Dashboard</h1>
            <p className="techdash-subtitle">
              Assigned ticket analytics and latest activity
            </p>
          </div>
        </div>

        <div className="techdash-user-card">
          <span className="techdash-user-label">Logged in as</span>
          <span className="techdash-user-value">
            {technicianEmail || "Unknown"}
          </span>
        </div>

        <div className="techdash-summary-grid">
          <div className="techdash-summary-card techdash-card-total">
            <p>Total Assigned Tickets</p>
            <h2>{analytics.total}</h2>
          </div>

          <div className="techdash-summary-card techdash-card-progress">
            <p>In Progress Tickets</p>
            <h2>{analytics.inProgress}</h2>
          </div>

          <div className="techdash-summary-card techdash-card-resolved">
            <p>Resolved Tickets</p>
            <h2>{analytics.resolved}</h2>
          </div>

          <div className="techdash-summary-card techdash-card-high">
            <p>High Priority Tickets</p>
            <h2>{analytics.high}</h2>
          </div>
        </div>

        <div className="techdash-grid-two">
          <div className="techdash-panel">
            <h3>Overview</h3>
            <p className="techdash-panel-subtext">
              Summary based only on tickets assigned to you
            </p>

            <div className="techdash-mini-grid">
              <div className="techdash-mini-card">
                <span>{analytics.open}</span>
                <p>Open</p>
              </div>

              <div className="techdash-mini-card">
                <span>{analytics.inProgress}</span>
                <p>In Progress</p>
              </div>

              <div className="techdash-mini-card">
                <span>{analytics.resolved}</span>
                <p>Resolved</p>
              </div>

              <div className="techdash-mini-card">
                <span>{analytics.closed}</span>
                <p>Closed</p>
              </div>
            </div>

            <div className="techdash-insight-card">
              <h4>Latest Insight</h4>
              <p>
                You currently have <strong>{analytics.total}</strong> assigned
                ticket(s). Out of them,{" "}
                <strong>{analytics.inProgress}</strong> are in progress and{" "}
                <strong>{analytics.high}</strong> are high priority.
              </p>
            </div>
          </div>

          <div className="techdash-panel">
            <h3>Status Breakdown</h3>
            <p className="techdash-panel-subtext">
              Distribution of your assigned tickets by status
            </p>

            <div className="techdash-doughnut-wrap">
              <div
                className="techdash-doughnut-chart"
                style={analytics.doughnutStyle}
              >
                <div className="techdash-doughnut-center">
                  <strong>{analytics.totalStatus}</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="techdash-doughnut-legend">
                {analytics.statusLegend.map((item) => (
                  <div key={item.label} className="techdash-legend-item">
                    <span className={`techdash-legend-dot ${item.className}`}></span>
                    <span className="techdash-legend-label">{item.label}</span>
                    <span className="techdash-legend-meta">
                      {item.value} ({item.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="techdash-grid-two">
          <div className="techdash-panel">
            <h3>Priority Distribution</h3>
            <p className="techdash-panel-subtext">
              Assigned tickets by priority
            </p>

            <div className="techdash-bar-list">
              {analytics.priorityItems.map((item) => (
                <div key={item.label} className="techdash-bar-item">
                  <div className="techdash-bar-head">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>

                  <div className="techdash-bar-track">
                    <div
                      className="techdash-bar-fill techdash-priority-fill"
                      style={{
                        width: `${(item.value / analytics.maxPriority) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="techdash-panel">
            <div className="techdash-panel-head">
              <div>
                <h3>Recent Assigned Tickets</h3>
                <p className="techdash-panel-subtext">
                  Latest updated tickets assigned to you
                </p>
              </div>
            </div>

            {analytics.recentTickets.length === 0 ? (
              <p className="techdash-empty">No assigned tickets found.</p>
            ) : (
              <div className="techdash-recent-list">
                {analytics.recentTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="techdash-recent-item techdash-recent-link"
                  >
                    <div className="techdash-recent-main">
                      <h4>{ticket.title}</h4>
                      <p>{ticket.ticketCode}</p>
                      <small>
                        {ticket.category} • {ticket.location}
                      </small>
                    </div>

                    <div className="techdash-recent-right">
                      <span
                        className={`techdash-badge techdash-priority-${ticket.priority?.toLowerCase()}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`techdash-badge techdash-status-${ticket.status?.toLowerCase()}`}
                      >
                        {ticket.status?.replace("_", " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
}