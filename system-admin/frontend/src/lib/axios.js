import axios from "axios";

export const axiosAdmin = axios.create({
  baseURL: "http://localhost:5001/api/admin",
  withCredentials: true
});

export const axiosProduct = axios.create({
  baseURL: "http://localhost:5001/api/products",
  withCredentials: true
});

export const axiosOrder = axios.create({
  baseURL: "http://localhost:5001/api/orders",
  withCredentials: true
});