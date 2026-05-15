export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const API_PREFIXES = {
  tutors: "/api",
  attendance: "/api",
  referrals: "/api/v1",
  expenses: "/api/expenses",
};

export const AUTH_STORAGE_KEYS = {
  token: "auth_token",
  user: "auth_user",
};

export const getApiUrl = (prefix = "") => `${API_BASE_URL}${prefix}`;
