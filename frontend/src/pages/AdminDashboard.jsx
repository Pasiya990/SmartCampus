import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import API from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [overview, setOverview] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/test")
      .then((res) => setMessage(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setMessage("Forbidden - You are not allowed");
        } else {
          setMessage("Hello ADMIN");
        }
      });

    API.get("/api/admin/analytics-admin-dash/overview")
      .then((res) => {
        setOverview(res.data);
        setLoadingAnalytics(false);
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setLoadingAnalytics(false);

        if (err.response?.status === 403) {
          setAnalyticsError("Forbidden - Only admins can access analytics.");
        } else if (err.response?.status === 404) {
          setAnalyticsError("Analytics endpoint not found. Check backend URL/path.");
        } else {
          setAnalyticsError("Failed to load analytics data.");
        }
      });
  }, []);

  const handleMenuClick = (menuKey, path) => {
    setActiveMenu(menuKey);
    if (path) navigate(path);
  };

  const statusChartData = useMemo(() => {
    if (!overview?.summary) return [];
    return [
      { name: "Approved", value: overview.summary.approvedBookings || 0 },
      { name: "Pending", value: overview.summary.pendingBookings || 0 },
      { name: "Rejected", value: overview.summary.rejectedBookings || 0 },
      { name: "Cancelled", value: overview.summary.cancelledBookings || 0 },
    ];
  }, [overview]);

  const pieColors = ["#6d5bd0", "#f0c34e", "#58c27d", "#f28b82"];

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-icon">📘</div>
            <div>
              <h2>Headstart</h2>
              <p>{message || "Admin Panel"}</p>
            </div>
          </div>

          <div className="sidebar-menu">
            <button
              className={`admin-side-btn ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveMenu("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "tickets" ? "active" : ""}`}
              onClick={() => handleMenuClick("tickets", "/tickets")}
            >
              Tickets
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "bookings" ? "active" : ""}`}
              onClick={() => handleMenuClick("bookings", "/admin/bookings")}
            >
              Bookings
            </button>

            <button
              className={`admin-side-btn ${activeMenu === "resources" ? "active" : ""}`}
              onClick={() => handleMenuClick("resources", "/resources")}
            >
              Resources
            </button>
          </div>
        </div>

        <div className="sidebar-bottom-art"></div>
        <div className="sidebar-leaf leaf-1"></div>
        <div className="sidebar-leaf leaf-2"></div>
        <div className="sidebar-leaf leaf-3"></div>
        <div className="sidebar-leaf leaf-4"></div>
      </aside>

      <main className="admin-main">
        <div className="admin-main-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Campus resource insights and booking analytics</p>
          </div>
        </div>

        {loadingAnalytics && (
          <div className="analytics-status-card">Loading analytics...</div>
        )}

        {analyticsError && (
          <div className="analytics-status-card error">{analyticsError}</div>
        )}

        {!loadingAnalytics && !analyticsError && overview && (
          <>
            <section className="summary-grid">
              <div className="summary-card soft-pink">
                <span>Total Resources</span>
                <h3>{overview.summary?.totalResources ?? 0}</h3>
              </div>

              <div className="summary-card soft-purple">
                <span>Active Resources</span>
                <h3>{overview.summary?.activeResources ?? 0}</h3>
              </div>

              <div className="summary-card soft-yellow">
                <span>Approved Bookings</span>
                <h3>{overview.summary?.approvedBookings ?? 0}</h3>
              </div>

              <div className="summary-card soft-green">
                <span>Approval Rate</span>
                <h3>{overview.summary?.approvalRate ?? 0}%</h3>
              </div>
            </section>

            <section className="analytics-grid top-layout">
              <div className="analytics-card calendar-card">
                <div className="card-header">
                  <h3>Overview</h3>
                  <p>Weekly usage summary</p>
                </div>

                <div className="mini-stats-grid">
                  <div className="mini-stat-box">
                    <strong>{overview.summary?.utilizedResources ?? 0}</strong>
                    <span>Utilized Resources</span>
                  </div>

                  <div className="mini-stat-box">
                    <strong>{overview.summary?.averageApprovedBookingHours ?? 0}</strong>
                    <span>Avg Booking Hours</span>
                  </div>

                  <div className="mini-stat-box">
                    <strong>{overview.summary?.pendingBookings ?? 0}</strong>
                    <span>Pending</span>
                  </div>

                  <div className="mini-stat-box">
                    <strong>{overview.summary?.cancelledBookings ?? 0}</strong>
                    <span>Cancelled</span>
                  </div>
                </div>

                <div className="notification-box">
                  <h4>Latest Insight</h4>
                  <p>
                    Peak demand and top resource usage are shown through charts and summaries
                    for faster admin decision-making.
                  </p>
                </div>
              </div>

              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Top Resources</h3>
                  <p>Most frequently approved resources</p>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={overview.topResources || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="resourceName" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookingCount" fill="#6d5bd0" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="analytics-grid middle-layout">
              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Peak Booking Hours</h3>
                  <p>Busiest approved booking times</p>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={overview.peakHours || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookingCount" fill="#8fd3e8" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Status Distribution</h3>
                  <p>Overall booking workflow</p>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="analytics-grid bottom-layout">
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Busiest Days</h3>
                  <p>Approved bookings by weekday</p>
                </div>

                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.busiestDays?.length > 0 ? (
                      overview.busiestDays.map((item, index) => (
                        <tr key={`${item.dayName}-${index}`}>
                          <td>{item.dayName}</td>
                          <td>{item.bookingCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No busiest day data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="analytics-card">
                <div className="card-header">
                  <h3>Resource Type Usage</h3>
                  <p>Approved bookings by category</p>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={overview.resourceTypeUsage || []}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 25, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="resourceType"
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="bookingCount" fill="#58c27d" radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}