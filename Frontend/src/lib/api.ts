import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
export const apiClient = axios.create({ baseURL: API_BASE_URL });

export { API_BASE_URL };