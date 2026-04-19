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

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/test")
      .then((res) => setMessage(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setMessage("Forbidden - You are not allowed");
        } else {
          setMessage("Error occurred");
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

  const handleViewTickets = () => navigate("/tickets");
  const handleViewBookings = () => navigate("/admin/bookings");
  const handleViewResources = () => navigate("/resources");

  const statusChartData = useMemo(() => {
    if (!overview?.summary) return [];
    return [
      { name: "Approved", value: overview.summary.approvedBookings || 0 },
      { name: "Pending", value: overview.summary.pendingBookings || 0 },
      { name: "Rejected", value: overview.summary.rejectedBookings || 0 },
      { name: "Cancelled", value: overview.summary.cancelledBookings || 0 },
    ];
  }, [overview]);

  const pieColors = ["#0d9488", "#f59e0b", "#ef4444", "#64748b"];

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>{message || "Hello ADMIN"}</p>
        </div>

        <button className="admin-side-btn" onClick={handleViewTickets}>
          View All Tickets
        </button>

        <button className="admin-side-btn" onClick={handleViewBookings}>
          View All Bookings
        </button>

        <button className="admin-side-btn" onClick={handleViewResources}>
          View Resource Catalogue
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-main-header">
          <div>
            <h1>Usage Analytics Dashboard</h1>
            <p>Top resources, booking demand, and usage patterns</p>
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
              <div className="summary-card">
                <span>Total Resources</span>
                <h3>{overview.summary?.totalResources ?? 0}</h3>
              </div>

              <div className="summary-card">
                <span>Active Resources</span>
                <h3>{overview.summary?.activeResources ?? 0}</h3>
              </div>

              <div className="summary-card">
                <span>Approved Bookings</span>
                <h3>{overview.summary?.approvedBookings ?? 0}</h3>
              </div>

              <div className="summary-card">
                <span>Approval Rate</span>
                <h3>{overview.summary?.approvalRate ?? 0}%</h3>
              </div>

              <div className="summary-card">
                <span>Utilized Resources</span>
                <h3>{overview.summary?.utilizedResources ?? 0}</h3>
              </div>

              <div className="summary-card">
                <span>Avg Booking Hours</span>
                <h3>{overview.summary?.averageApprovedBookingHours ?? 0}</h3>
              </div>
            </section>

            <section className="analytics-grid analytics-grid-top">
              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Top Resources</h3>
                  <p>Most frequently approved resources</p>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={overview.topResources || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="resourceName" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookingCount" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Peak Booking Hours</h3>
                  <p>Busiest approved booking times</p>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={overview.peakHours || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookingCount" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="analytics-grid analytics-grid-bottom">
              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Booking Status Distribution</h3>
                  <p>Overall workflow distribution</p>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="analytics-card chart-card">
                <div className="card-header">
                  <h3>Resource Type Usage</h3>
                  <p>Approved bookings by resource type</p>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={overview.resourceTypeUsage || []}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 35, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="resourceType"
                      type="category"
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="bookingCount" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="analytics-grid analytics-grid-last">
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
                  <h3>Top Resources Table</h3>
                  <p>Resource performance breakdown</p>
                </div>

                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.topResources?.length > 0 ? (
                      overview.topResources.map((item) => (
                        <tr key={item.resourceId}>
                          <td>{item.resourceName}</td>
                          <td>{item.resourceType}</td>
                          <td>{item.location}</td>
                          <td>{item.bookingCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No top resource data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}