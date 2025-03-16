import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000/api"
    : "https://health-care-sepia-tau.vercel.app/api";

axios.defaults.withCredentials = true;
axios.defaults.credentials = true;
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
