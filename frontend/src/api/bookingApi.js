import axios from 'axios';

const BASE = 'http://localhost:8080/api/bookings';

// Temporary headers until OAuth is wired up
const headers = (role = 'USER') => ({
  'X-User-Id': localStorage.getItem('userId') || 1,
  'X-User-Role': role,
});

export const createBooking = (data) =>
  axios.post(BASE, data, { headers: headers() });

export const getMyBookings = () =>
  axios.get(BASE, { headers: headers('USER') });

export const getAllBookings = (status) =>
  axios.get(BASE, {
    headers: headers('ADMIN'),
    params: status ? { status } : {},
  });

export const approveBooking = (id) =>
  axios.put(`${BASE}/${id}/approve`, null , { headers: headers('ADMIN') });

export const rejectBooking = (id, reason) =>
  axios.put(`${BASE}/${id}/reject`, { reason }, { headers: headers('ADMIN') });

export const cancelBooking = (id) =>
  axios.put(`${BASE}/${id}/cancel`, null , { headers: headers() });

export const deleteOwnBooking = (id) =>
  axios.delete(`${BASE}/${id}/own`, { headers: headers() });

export const editBooking = (id, data) =>
  axios.put(`${BASE}/${id}/edit`, data, { headers: headers() });