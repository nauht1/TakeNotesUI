import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1"
});

export default instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

