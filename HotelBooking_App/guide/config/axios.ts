import axios from 'axios'

// Force reload for axios config - Updated at 2025-01-03
const base = import.meta.env.DEV
    ? 'http://localhost:8080/api/'
    : 'https://hotel-booking-app-server-eight.vercel.app/api/';

console.log('Axios baseURL:', base);

const axiosGuide = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || base
});

// Add request interceptor to include token
axiosGuide.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hdv_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
axiosGuide.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('hdv_token');
            localStorage.removeItem('hdv_refresh_token');
            localStorage.removeItem('hdv_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosGuide
