import axios from 'axios';

// Create a reusable axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend API URL
});

// Attach token automatically if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token saved on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
