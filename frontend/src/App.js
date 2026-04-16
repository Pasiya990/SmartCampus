import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';

export default function App() {
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
      </Routes>
    </BrowserRouter>
  );
}