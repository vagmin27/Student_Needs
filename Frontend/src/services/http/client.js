import axios from "axios";
import { setupInterceptors } from "./interceptors.js";

// Ensure environment variable is provided, default to localhost for fallback
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create the core, centralized axios instance
export const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach standard interceptors
setupInterceptors(httpClient);
