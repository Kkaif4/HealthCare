import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://healthcare-1-zl38.onrender.com/api';
} else {
  axios.defaults.baseURL = 'http://localhost:5000/api';
}
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
