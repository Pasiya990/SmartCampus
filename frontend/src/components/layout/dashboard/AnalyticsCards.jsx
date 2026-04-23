import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
  } from "recharts";
  import "./Analytics.css";
  
  export default function AnalyticsCards({ tickets = [], bookings = [] }) {
  
    /* =======================
       📊 WEEKLY TICKETS
    ======================= */
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();
  
    const weeklyData = last7Days.map((date) => {
      const dayName = days[date.getDay()];
  
      const count = tickets.filter((t) => {
        const tDate = new Date(t.createdAt || t.date);
        return tDate.toDateString() === date.toDateString();
      }).length;
  
      return { day: dayName, tickets: count };
    });
  
    const totalWeeklyTickets = weeklyData.reduce((sum, d) => sum + d.tickets, 0);
  
    /* =======================
       ✅ RESOLVED RATE
    ======================= */
    const resolved = tickets.filter(
      (t) => t.status?.toLowerCase() === "resolved"
    ).length;
  
    const resolvedRate =
      tickets.length === 0 ? 0 : Math.round((resolved / tickets.length) * 100);
  
    /* =======================
       🔄 ACTIVE TICKETS
    ======================= */
    const active = tickets.filter(
      (t) =>
        t.status?.toLowerCase() === "pending" ||
        t.status?.toLowerCase() === "in_progress"
    ).length;
  
    /* =======================
       📅 BOOKING USAGE
    ======================= */
    const approved = bookings.filter(
      (b) => b.status?.toLowerCase() === "approved"
    ).length;
  
    const usage =
      bookings.length === 0 ? 0 : Math.round((approved / bookings.length) * 100);
  
    const bookingData = [
      { name: "Used", value: usage },
      { name: "Free", value: 100 - usage }
    ];
  
    return (
      <div className="analytics">
  
        {/* 📈 WEEKLY TICKETS */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h4>Weekly Tickets</h4>
          </div>
  
          <h2>{totalWeeklyTickets}</h2>
          <p className="sub">Last 7 days</p>
  
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
  
        {/* ✅ RESOLVED RATE */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h4>Resolved Rate</h4>
          </div>
  
          <h2>{resolvedRate}%</h2>
          <p className="sub">Your tickets</p>
  
          <div className="circle">
            <svg viewBox="0 0 36 36">
              <path
                className="bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
              />
              <path
                className="progress"
                strokeDasharray={`${resolvedRate}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
              />
            </svg>
          </div>
        </div>
  
        {/* 🔄 ACTIVE */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h4>Active Tickets</h4>
          </div>
  
          <h2>{active}</h2>
          <p className="sub">Currently ongoing</p>
        </div>
  
        {/* 🥧 BOOKING USAGE */}
        <div className="analytics-card highlight">
          <div className="analytics-header">
            <h4>Booking Usage</h4>
          </div>
  
          <h2>{usage}%</h2>
          <p className="sub">Your reservations</p>
  
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={bookingData}
                dataKey="value"
                innerRadius={40}
                outerRadius={60}
              >
                <Cell fill="#4f46e5" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
  
      </div>
    );
  }