import API from "../services/api";

export const createTicket = async (ticketData, files) => {
  const formData = new FormData();

  formData.append("ticket", JSON.stringify(ticketData));

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }
  

  const response = await API.post("/api/tickets", formData);

  return response.data;
};

export const getAllTickets = async () => {
  const response = await API.get("/api/tickets");
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await API.get(`/api/tickets/${id}`);
  return response.data;
};

export const getCommentsByTicketId = async (ticketId) => {
  const response = await API.get(`/api/tickets/${ticketId}/comments`);
  return response.data;
};

export const addComment = async (ticketId, commentData) => {
  const response = await API.post(`/api/tickets/${ticketId}/comments`, commentData);
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await API.put(`/api/tickets/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId, deleteData) => {
  const response = await API.delete(`/api/tickets/comments/${commentId}`, {
    data: deleteData,
  });
  return response.data;
};

export const assignTechnician = async (ticketId, technicianName) => {
  const response = await API.patch(`/api/tickets/${ticketId}/assign-technician`, {
    technicianName,
  });
  return response.data;
};

export const updateTicketStatus = async (ticketId, statusData) => {
  const response = await API.patch(`/api/tickets/${ticketId}/status`, statusData);
  return response.data;
};

export const getTicketsByAssignedTechnician = async (technicianName) => {
  const response = await API.get(
    `/api/tickets/assigned-technician/${encodeURIComponent(technicianName)}`
  );
  return response.data;
};