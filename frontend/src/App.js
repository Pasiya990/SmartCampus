import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import './App.css';

function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { to: '/book', label: 'New Booking' },
    { to: '/my-bookings', label: 'My Bookings' },
    { to: '/admin/bookings', label: 'Admin View' },
  ];
  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      height: 60,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)', marginRight: 24, letterSpacing: '-0.3px' }}>
        🏛 CampusBook
      </span>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{
          padding: '6px 14px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          color: pathname === l.to ? 'var(--accent)' : 'var(--text-secondary)',
          background: pathname === l.to ? 'var(--accent-light)' : 'transparent',
          transition: 'all 0.15s',
        }}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/book" element={<BookingFormPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
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