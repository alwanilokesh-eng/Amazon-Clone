import axios from 'axios';

// Same-origin deployments (frontend served by the API, or a dev proxy) can
// leave this unset. Cross-origin deployments (e.g. frontend on Vercel,
// backend on Render) should set VITE_API_URL to the backend's full URL.
const baseURL = `${import.meta.env.VITE_API_URL || ''}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
