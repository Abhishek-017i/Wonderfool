import axios from 'axios';
import useAuthStore from '../store/authStore';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  // First try to get fresh token from Firebase
  let token = null;
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn("Failed to get fresh Firebase token", err);
    }
  }
  
  if (!token) {
    token = useAuthStore.getState().token;
  }

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;