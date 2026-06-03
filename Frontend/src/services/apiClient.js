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

    config.headers.Authorization = token
      ? `Bearer ${token}`
      : "";

    return config;
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        const urlStr = originalRequest.url || "";
        if (
          urlStr.includes("/refresh") ||
          urlStr.includes("/login") ||
          urlStr.includes("/signup") ||
          urlStr.includes("/verify-otp") ||
          urlStr.includes("/forgot-password") ||
          urlStr.includes("/reset-password")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const userStr = localStorage.getItem("user") || localStorage.getItem("User");
          const user = userStr ? JSON.parse(userStr) : null;
          const accountType = user?.accountType || "student";
          const refreshUrl =
            accountType === "alumni"
              ? `${getApiUrl(API_PREFIXES.referrals)}/alumni/refresh`
              : `${getApiUrl(API_PREFIXES.referrals)}/student/refresh`;

          const res = await axios.post(refreshUrl, {}, { withCredentials: true });

          if (res.data.success && res.data.token) {
            const newToken = res.data.token;
            localStorage.setItem(AUTH_STORAGE_KEYS.token, newToken);
            localStorage.setItem("token", newToken);

            client.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processQueue(null, newToken);
            isRefreshing = false;
            return client(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;

          // Clear credentials
          localStorage.removeItem("user");
          localStorage.removeItem("User");
          localStorage.removeItem("token");
          localStorage.removeItem(AUTH_STORAGE_KEYS.token);

          // Force redirect if on a protected page
          const path = window.location.pathname;
          if (path.startsWith("/student") || path.startsWith("/alumni")) {
            window.location.href = "/role-selector";
          }
          return Promise.reject(refreshError);
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
