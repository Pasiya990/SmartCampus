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

export const deleteNotification = async (id) => {
    await API.delete(`/api/notifications/${id}`);
};

export const markAllAsRead = async (email) => {
    await API.put(`/api/notifications/read-all/${email}`);
};
  
  export const clearAllNotifications = async (email) => {
    await API.delete(`/api/notifications/clear/${email}`);
};