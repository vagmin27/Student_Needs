import axios from "axios";

const api = axios.create({
  baseURL: "/api/attendance", // Adjust based on backend routes
  withCredentials: true,
});

// Centralized API wrapper for Attendance module
export const attendanceApi = {
  // Add methods here incrementally, e.g.:
  // getAttendance: () => api.get("/"),
};
