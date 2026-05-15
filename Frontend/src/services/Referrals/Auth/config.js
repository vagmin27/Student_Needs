import { API_PREFIXES, AUTH_STORAGE_KEYS, getApiUrl } from "@/config/api.js";

export const API_BASE_URL = getApiUrl(API_PREFIXES.referrals);

export const AUTH_ENDPOINTS = {
  student: {
    signup: "/student/signup",
    login: "/student/login",
  },
  alumni: {
    signup: "/alumni/signup",
    login: "/alumni/login",
  },
};

export const TOKEN_STORAGE_KEY = AUTH_STORAGE_KEYS.token;
export const USER_STORAGE_KEY = AUTH_STORAGE_KEYS.user;
