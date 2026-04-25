import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import { getNotifications } from "../api/notificationApi";
import { resourceService } from "../services/resourceService";

import DashboardHero from "../components/layout/dashboard/DashboardHero";
import QuickActions from "../components/layout/dashboard/QuickActions";
import RecentTickets from "../components/layout/dashboard/RecentTickets";
import UpcomingBookings from "../components/layout/dashboard/UpcomingBookings";
import AlertsCard from "../components/layout/dashboard/AlertsCard";
import OutOfServiceResources from "../components/layout/dashboard/OutOfServiceResources";

import "./UserDashboard.css";

export default function UserDashboard() {

  const [name, setName] = useState("User"); // ✅ FIXED
  const [outages, setOutages] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    bookings: 0
  });

  // ✅ get email from token
  const token = localStorage.getItem("token");

  

  let email = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.sub;
    } catch {}
  }


  // ✅ FETCH USER NAME FROM BACKEND
  // ✅ functions FIRST
    const fetchUser = useCallback(async () => {
      try {
        const res = await API.get("/user/me");
        setName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }, []);

    const fetchDashboardData = useCallback(async () => {
      try {
        const ticketRes = await API.get("/api/tickets/my-tickets");
        const bookingRes = await API.get("/api/bookings");

        const ticketData = ticketRes.data || [];
        const allBookings = bookingRes.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

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

        const notiData = await getNotifications(email);

        const resourceRes = await resourceService.getAll();
        const allResources = resourceRes.data || [];

        const unavailable = allResources.filter(
          (r) =>
            r.status === "OUT_OF_SERVICE" ||
            r.status === "MAINTENANCE"
        );

        setTickets(ticketData);
        setBookings(filteredBookings);
        setNotifications(notiData || []);
        setOutages(unavailable);

        const active = ticketData.length;
        const pending = ticketData.filter(
          (t) => t.status?.toLowerCase() === "pending"
        ).length;

        setStats({
          active,
          pending,
          bookings: filteredBookings.length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }, [email]);

    // ✅ THEN useEffect
    useEffect(() => {
      fetchDashboardData();
      fetchUser();
    }, [fetchDashboardData, fetchUser]);

  return (
    <div className="dashboard">

      {/* 🔥 HERO WITH REAL NAME */}
      <DashboardHero name={name} stats={stats} />

      <QuickActions />

      <div className="grid">

        {/* LEFT SIDE */}
        <div className="main">
          <RecentTickets tickets={tickets} />

          <AlertsCard
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="side">
          <UpcomingBookings bookings={bookings} />
          <OutOfServiceResources resources={outages} />
        </div>

      </div>

    </div>
  );
}