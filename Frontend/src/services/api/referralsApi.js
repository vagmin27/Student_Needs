import axios from "axios";

const api = axios.create({
  baseURL: "/api/referrals", // Adjust based on backend routes
  withCredentials: true,
});

// Centralized API wrapper for Referrals module
export const referralsApi = {
  // Add methods here incrementally, e.g.:
  // getInterviews: () => api.get("/interviews"),
};
