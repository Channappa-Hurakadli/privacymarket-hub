import axios from 'axios';
import { AppUser } from '../utils/auth'; // We'll use the AppUser type for consistency

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: AppUser = JSON.parse(userString);
      if (user?.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
