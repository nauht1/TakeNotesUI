import axios from "axios";

const axiosToken = axios.create({
  baseURL: "http://localhost:8080/api/v1"
});

axiosToken.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

const axiosNoToken = axios.create({
  baseURL: "http://localhost:8080/api/v1"
});

export {axiosToken,axiosNoToken};