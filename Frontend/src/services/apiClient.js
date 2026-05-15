import axios from "axios";
import { API_PREFIXES, AUTH_STORAGE_KEYS, getApiUrl } from "@/config/api.js";

export const createApiClient = (prefix = "") => {
  const client = axios.create({
    baseURL: getApiUrl(prefix),
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
    const token =
      localStorage.getItem(AUTH_STORAGE_KEYS.token) ||
      localStorage.getItem("token") ||
      expenseUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return client;
};

export const apiClient = createApiClient();
export const tutorsApiClient = createApiClient(API_PREFIXES.tutors);
export const attendanceApiClient = createApiClient(API_PREFIXES.attendance);
export const referralsApiClient = createApiClient(API_PREFIXES.referrals);
export const expensesApiClient = createApiClient(API_PREFIXES.expenses);
