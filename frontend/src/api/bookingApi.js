import axios from 'axios';

const BASE = 'http://localhost:8080/api/bookings';

// ✅ Use JWT token instead of custom headers
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// 🔹 USER APIs
export const createBooking = (data) =>
  axios.post(BASE, data, { headers: headers() });

export const getMyBookings = () =>
  axios.get(BASE, { headers: headers() });

export const cancelBooking = (id) =>
  axios.put(`${BASE}/${id}/cancel`, null, { headers: headers() });

export const deleteOwnBooking = (id) =>
  axios.delete(`${BASE}/${id}/own`, { headers: headers() });

export const editBooking = (id, data) =>
  axios.put(`${BASE}/${id}/edit`, data, { headers: headers() });

// 🔹 ADMIN APIs
export const getAllBookings = (status) =>
  axios.get(BASE, {
    headers: headers(),
    params: status ? { status } : {},
  });

export const approveBooking = (id) =>
  axios.put(`${BASE}/${id}/approve`, null, { headers: headers() });

export const rejectBooking = (id, reason) =>
  axios.put(`${BASE}/${id}/reject`, { reason }, { headers: headers() });

export const checkAvailability = (params) =>
  axios.get(`${BASE}/check-availability`, {
    params,
    headers: headers()
  });