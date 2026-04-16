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