import api from './index';

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password })
};

export const keywordApi = {
  getAll: () => api.get('/keywords'),
  create: (data: any) => api.post('/keywords', data),
  update: (id: number, data: any) => api.put(`/keywords/${id}`, data),
  delete: (id: number) => api.delete(`/keywords/${id}`)
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData);
  }
};
