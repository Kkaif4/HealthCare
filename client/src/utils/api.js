import axios from "axios";

const axiosInstace = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstace.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstace.interceptors.request.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, params) => axiosInstace.get(url, { params }),
  post: (url, data) => axiosInstace.post(url, data),
  put: (url, data) => axiosInstace.put(url, data),
  delete: (url) => axiosInstace.delete(url),
};

export default api;
