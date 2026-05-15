import { referralsApiClient } from "@/services/apiClient.js";
import { AUTH_ENDPOINTS } from "./config.js";

export async function studentSignup(payload) {
  const response = await referralsApiClient.post(AUTH_ENDPOINTS.student.signup, payload);
  return response.data;
}

export async function studentLogin(payload) {
  const response = await referralsApiClient.post(AUTH_ENDPOINTS.student.login, payload);
  return response.data;
}

export async function alumniSignup(payload) {
  const response = await referralsApiClient.post(AUTH_ENDPOINTS.alumni.signup, payload);
  return response.data;
}

export async function alumniLogin(payload) {
  const response = await referralsApiClient.post(AUTH_ENDPOINTS.alumni.login, payload);
  return response.data;
}

export async function authenticatedRequest(url, token, options = {}) {
  const response = await referralsApiClient.request({
    url,
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
