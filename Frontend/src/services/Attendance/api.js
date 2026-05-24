import { attendanceApiClient as API } from "@/services/apiClient.js";

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      error.message =
        error.response?.data?.message || "Session expired. Please sign in again.";
    }
    return Promise.reject(error);
  }
);

/** Paths relative to /api */
export const ATTENDANCE_PATHS = {
  subjects: "/subjects/subjects",
  subject: (id) => `/subjects/subjects/${id}`,
  stats: "/attendance/stats",
  records: "/attendance/records",
  record: (id) => `/attendance/records/${id}`,
  student: "/attendance/student",
};

export default API;
