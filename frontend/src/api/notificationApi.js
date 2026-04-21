import API from "../services/api";

// get notifications
export const getNotifications = async (email) => {
  const res = await API.get(`/api/notifications/${email}`);
  return res.data;
};

// mark as read
export const markAsRead = async (id) => {
  await API.patch(`/api/notifications/${id}/read`);
};