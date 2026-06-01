import { attendanceApiClient as API } from "@/services/apiClient.js";

export const TUTOR_ATTENDANCE_PATHS = {
  tutorSubjects: "/tutor-attendance/tutor/subjects",
  tutorSubject: (id) => `/tutor-attendance/tutor/subjects/${id}`,
  tutorEnrolled: "/tutor-attendance/tutor/enrolled",
  tutorSession: "/tutor-attendance/tutor/session",
  studentSummary: "/tutor-attendance/student/summary",
  studentHistory: "/tutor-attendance/student/history",
};

export default API;
