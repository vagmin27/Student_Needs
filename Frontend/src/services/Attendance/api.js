import { attendanceApiClient as API } from "@/services/apiClient.js";

/** Paths relative to /api (attendance router is mounted at /api/attendance). */
export const ATTENDANCE_PATHS = {
  root: "/attendance",
  student: "/attendance/student",
  studentByRegister: (register) => `/attendance/student/${register}`,
  download: (start, end) => `/attendance/data/download?start=${start}&end=${end}`,
};

export default API;
