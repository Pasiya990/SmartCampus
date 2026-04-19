import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleViewTickets = () => {
    navigate("/tickets");
  };

  const handleViewBookings = () => {
    navigate("/admin/bookings");
  };

  const handleViewResources = () => {
    navigate("/resources");
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>{message}</p>
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
          <h1>Usage Analytics Dashboard</h1>
          <p>Top resources, booking demand, and usage patterns</p>
        </div>

        {loadingAnalytics && (
          <div className="analytics-status-card">
            Loading analytics...
          </div>
        )}

        {analyticsError && (
          <div className="analytics-status-card error">
            {analyticsError}
          </div>
        )}

        {!loadingAnalytics && !analyticsError && overview && (
          <>
            <section className="summary-grid">
              <div className="summary-card">
                <h4>Total Resources</h4>
                <p>{overview.summary?.totalResources ?? 0}</p>
              </div>

              <div className="summary-card">
                <h4>Active Resources</h4>
                <p>{overview.summary?.activeResources ?? 0}</p>
              </div>

              <div className="summary-card">
                <h4>Out of Service</h4>
                <p>{overview.summary?.outOfServiceResources ?? 0}</p>
              </div>

              <div className="summary-card">
                <h4>Total Bookings</h4>
                <p>{overview.summary?.totalBookings ?? 0}</p>
              </div>

              <div className="summary-card">
                <h4>Approved Bookings</h4>
                <p>{overview.summary?.approvedBookings ?? 0}</p>
              </div>

              <div className="summary-card">
                <h4>Approval Rate</h4>
                <p>{overview.summary?.approvalRate ?? 0}%</p>
              </div>
            </section>

            <section className="analytics-grid">
              <div className="analytics-card">
                <h3>Top Resources</h3>
                <table>
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

              <div className="analytics-card">
                <h3>Peak Booking Hours</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Hour</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.peakHours?.length > 0 ? (
                      overview.peakHours.map((item, index) => (
                        <tr key={`${item.hour}-${index}`}>
                          <td>{item.label}</td>
                          <td>{item.bookingCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No peak hour data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="analytics-card">
                <h3>Resource Type Usage</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.resourceTypeUsage?.length > 0 ? (
                      overview.resourceTypeUsage.map((item, index) => (
                        <tr key={`${item.resourceType}-${index}`}>
                          <td>{item.resourceType}</td>
                          <td>{item.bookingCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No resource type usage data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="analytics-card">
                <h3>Busiest Days</h3>
                <table>
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
            </section>
          </>
        )}
      </main>
    </div>
  );
}