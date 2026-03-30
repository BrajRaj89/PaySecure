import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.token) {
      console.log(`[API] Attaching token to request: ${config.url}`);
      config.headers['Authorization'] = 'Bearer ' + user.token;
    } else {
      console.warn(`[API] No token found for request: ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("[API] Unauthorized! Logging out...");
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
