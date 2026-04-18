
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianView from "./pages/TechnicianView";
import OAuthSuccess from "./pages/OAuthSuccess";
import UserDashboard from "./pages/UserDashboard";


import TicketCreate from "./pages/tickets/TicketCreate";
import TicketList from "./pages/tickets/TicketList";
import TicketDetails from "./pages/tickets/TicketDetails";
import MyTickets from "./pages/tickets/MyTickets";

import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import { Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    
     <nav style={{ padding: '12px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: 20 }}>
        <Link to="/book">New Booking</Link>
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/admin/bookings">Admin View</Link>
      </nav>

      <Routes>
        <Route path="/book" element={<BookingFormPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          
        <Route path="/" element={<Login />} /> 
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/technician" element={<TechnicianView />} />


        <Route path="/tickets/new" element={<TicketCreate />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;