import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import { getNotifications } from "../api/notificationApi";

import DashboardHero from "../components/layout/dashboard/DashboardHero";
import QuickActions from "../components/layout/dashboard/QuickActions";
import RecentTickets from "../components/layout/dashboard/RecentTickets";
import UpcomingBookings from "../components/layout/dashboard/UpcomingBookings";
import AlertsCard from "../components/layout/dashboard/AlertsCard";

import "./UserDashboard.css";

export default function UserDashboard() {

  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    bookings: 0
  });

  // ✅ decode inside component
  const token = localStorage.getItem("token");

  let email = "";
  if (token) {
    const decoded = jwtDecode(token);
    email = decoded.sub;
  }

  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ticketRes = await API.get("/api/tickets/my-tickets");
      const bookingRes = await API.get("/api/bookings");

      const ticketData = ticketRes.data || [];
      const allBookings = bookingRes.data || [];

      // 📅 today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // ✅ filter bookings
      const filteredBookings = allBookings
        .filter((b) => {
          const status = b.status?.toLowerCase();
          const bookingDate = new Date(b.date);

          return (
            (status === "pending" || status === "approved") &&
            bookingDate >= today
          );
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // 🔔 notifications
      const notiData = await getNotifications(email);

      setTickets(ticketData);
      setBookings(filteredBookings);
      setNotifications(notiData || []);

      const active = ticketData.length;
      const pending = ticketData.filter(
        (t) => t.status?.toLowerCase() === "pending"
      ).length;

      setStats({
        active,
        pending,
        bookings: filteredBookings.length
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  return (
    <div className="dashboard">

      <DashboardHero name={name} stats={stats} />

      <QuickActions />

      <div className="grid">

        <RecentTickets tickets={tickets} />

        <div className="side">
          <UpcomingBookings bookings={bookings} />
          <AlertsCard notifications={notifications} />
        </div>

      </div>

    </div>
  );
}