import axios from "axios";

// 🔥 Base URL from environment or default
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 🔥 Create Axios Instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ================= AUTH =================
export const getUser = () => API.get("/api/user");
export const login = (data) => API.post("/api/login", data);
export const logout = () => API.post("/api/logout");

// ================= PROFILE (STUDENT) =================
export const getProfile = () => API.get("/api/profile");
export const getEditProfile = () => API.get("/api/edit-profile");
export const editProfile = (data) => API.post("/api/edit-profile", data);

export const uploadProfilePic = (formData) => {
  return API.post("/api/edit-profile/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProfilePic = () => API.post("/api/edit-profile/delete-pic");

// ================= TUTORS =================
export const getTutors = (query, page = 0) =>
  API.get(`/api/tutors?query=${query}&page=${page}`);

export const getSchedule = () => API.get("/api/tutor/schedule");

// ================= ✅ TUTOR PROFILE (ADD THIS) =================
export const getTutorProfile = () => API.get("/api/tutor/profile");

export const editTutorProfile = (data) => API.put("/api/tutor/profile", data);

export const uploadTutorProfilePic = (data) =>
  API.post("/api/tutor/profile/upload", data);

export const deleteTutorProfilePic = () =>
  API.delete("/api/tutor/profile/delete");

export const getTutorAvailability = (id) =>
  API.get(`/api/tutor/${id}/availability`);

export const saveTutorAvailability = (data) =>
  API.post("/api/tutor/availability", data);

export default API;