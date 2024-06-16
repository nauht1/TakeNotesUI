import { axiosToken } from "../config/ApiConfig.js";

export const postFormUrlEncoded = (url, data) => {
  const formData = new URLSearchParams();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }

  return axiosToken.post(url, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const deleteFormUrlEncoded = (url, data) => {
  const params = new URLSearchParams();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      params.append(key, data[key]);
    }
  }

  return axiosToken.delete(url, {
    params: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};