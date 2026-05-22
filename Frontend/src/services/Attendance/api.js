import { attendanceApiClient as API } from "@/services/apiClient.js";

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
