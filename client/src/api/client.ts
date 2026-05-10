import axios from "axios";

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);