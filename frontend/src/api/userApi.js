import API from "../services/api";

export const updateNotificationPreference = async (email, enabled) => {
  await API.put(`/user/notifications/${email}`, { enabled });
};

export const getUser = async (email) => {
  const res = await API.get(`/user/${email}`);
  return res.data;
};