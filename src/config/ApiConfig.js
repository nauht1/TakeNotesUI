import axios from "axios";

// const baseURL = " https://chimp-direct-truly.ngrok-free.app/api/v1";
// const baseURL = "http://localhost:8080/api/v1";
const baseURL = "http://ec2-3-26-21-231.ap-southeast-2.compute.amazonaws.com/api/v1";

const axiosToken = axios.create({
  baseURL: baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
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
  baseURL: baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

export {axiosToken,axiosNoToken};