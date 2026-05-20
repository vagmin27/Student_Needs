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

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const isAuthRequest = error.config && (
          error.config.url.includes("/login") ||
          error.config.url.includes("/signup") ||
          error.config.url.includes("/register")
        );
        if (!isAuthRequest) {
          console.warn("Session expired or unauthorized. Logging out...");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("User");
          window.location.href = "/role-selection";
        }
      }

      // Retry logic for 5xx server errors or timeouts (idempotent requests only)
      const config = error.config;
      if (config && (!config.method || config.method.toLowerCase() === 'get')) {
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount < 2 && (!error.response || error.response.status >= 500)) {
          config.__retryCount += 1;
          console.warn(`[API] Retrying request (${config.__retryCount}/2): ${config.url}`);
          return new Promise(resolve => setTimeout(() => resolve(client(config)), 1000 * config.__retryCount));
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
export const tutorsApiClient = createApiClient(API_PREFIXES.tutors);
export const attendanceApiClient = createApiClient(API_PREFIXES.attendance);
export const referralsApiClient = createApiClient(API_PREFIXES.referrals);
export const expensesApiClient = createApiClient(API_PREFIXES.expenses);
