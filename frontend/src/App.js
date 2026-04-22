import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianView from "./pages/TechnicianView";
import OAuthSuccess from "./pages/OAuthSuccess";
import UserDashboard from "./pages/UserDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";

import TicketCreate from "./pages/tickets/TicketCreate";
import TicketList from "./pages/tickets/TicketList";
import TicketDetails from "./pages/tickets/TicketDetails";
import MyTickets from "./pages/tickets/MyTickets";

import BookingFormPage from "./pages/BookingFormPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

import ResourceCatalogue from "./pages/ResourceCatalogue";
import LandingPage from "./pages/LandingPage";
import BookingVerifyPage from './pages/BookingVerifyPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/technician" element={<TechnicianDashboard />} />
        <Route path="/resources" element={<ResourceCatalogue />} />

        <Route path="/book" element={<BookingFormPage />} />
        <Route path="/booking/:id" element={<BookingFormPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/booking/verify/:id" element={<BookingVerifyPage />} />

        <Route path="/tickets/new" element={<TicketCreate />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/technician/my-tickets" element={<TechnicianView />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;