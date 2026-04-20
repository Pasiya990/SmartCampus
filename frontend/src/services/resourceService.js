import API from "./api";

const BASE = "/api/resources";

const toFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const resourceService = {
  getAll: () => API.get(BASE),

  getById: (id) => API.get(`${BASE}/${id}`),

  search: (params) => API.get(`${BASE}/search`, { params }),

  getAvailable: () => API.get(`${BASE}/available`),

  getTypes: () => API.get(`${BASE}/types`),

  create: (data) =>
    API.post(BASE, toFormData(data), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id, data) =>
    API.put(`${BASE}/${id}`, toFormData(data), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateStatus: (id, status) =>
    API.patch(`${BASE}/${id}/status`, { status }),

  delete: (id) => API.delete(`${BASE}/${id}`),
};