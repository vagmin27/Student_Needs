/**
 * Tutorial module route hierarchy (single source of truth).
 * Entry must be moduleHome or landing — never default to search/book.
 */
export const TUTORIAL_PATHS = {
  /** Public marketing landing */
  landing: "/tutorials",
  /** Student module hub (choose search, bookings, profile, etc.) */
  moduleHome: "/tutorials/home",
  /** Unified sidebar / quick-action entry */
  unifiedEntry: "/tutorials/home",
  roleSelect: "/tutorials/login",
  studentLogin: "/tutorials/login/student",
  tutorLogin: "/tutorials/login/tutor",
  studentRegister: "/tutorials/register",
  tutorRegister: "/tutorials/register/tutor",
  /** Search & book flow — only from module home */
  studentSearch: "/tutorials/book",
  studentProfile: "/tutorials/profile",
  studentOnlineAttendance: "/tutorials/online-attendance",
  tutorAttendanceHub: "/tutorials/attendance",
  tutorManageSubjects: "/tutorials/attendance/subjects",
  tutorMarkAttendance: "/tutorials/attendance/mark-online",
  tutorHome: "/tutorials/tutor/dashboard",
  tutorSchedule: "/tutorials/tutor/schedule",
  tutorRequests: "/tutorials/tutor/accept",
  tutorProfile: "/tutorials/tutor/editProfile",
};

/**
 * Where to send user when entering the tutorials module from outside.
 * Does NOT open search/book directly.
 */
export function resolveTutorialEntryPath({
  isAuthenticated = false,
  isStudent = false,
  isTutor = false,
  role = "",
} = {}) {
  const normalizedRole = (role || "").toLowerCase();

  if (isTutor || normalizedRole === "tutor") {
    return isAuthenticated
      ? TUTORIAL_PATHS.tutorHome
      : TUTORIAL_PATHS.tutorLogin;
  }

  if (isStudent || normalizedRole === "student") {
    return isAuthenticated
      ? TUTORIAL_PATHS.moduleHome
      : TUTORIAL_PATHS.landing;
  }

  return TUTORIAL_PATHS.landing;
}
