import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL + '/api/resources';

const toFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value);
    }
  });

  return formData;
};

export const resourceService = {
  getAll: () => axios.get(BASE),

  getById: (id) => axios.get(`${BASE}/${id}`),

  search: (params) => axios.get(`${BASE}/search`, { params }),

  getAvailable: () => axios.get(`${BASE}/available`),

  getTypes: () => axios.get(`${BASE}/types`),

  create: (data) =>
    axios.post(BASE, toFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  update: (id, data) =>
    axios.put(`${BASE}/${id}`, toFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateStatus: (id, status) =>
    axios.patch(`${BASE}/${id}/status`, { status }),

  delete: (id) => axios.delete(`${BASE}/${id}`),
};