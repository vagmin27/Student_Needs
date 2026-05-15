import { tutorsApiClient as API } from "@/services/apiClient.js";
import { getApiUrl } from "@/config/api.js";

export const BASE_URL = getApiUrl("");

export const getUser = () => API.get("/user");
export const login = (data) => API.post("/login", data);
export const logout = () => API.post("/logout");

export const getProfile = () => API.get("/profile");
export const getEditProfile = () => API.get("/edit-profile");
export const editProfile = (data) => API.post("/edit-profile", data);

export const uploadProfilePic = (formData) => {
  return API.post("/edit-profile/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProfilePic = () => API.post("/edit-profile/delete-pic");

export const getTutors = (query, page = 0) =>
  API.get(`/tutors?query=${query}&page=${page}`);

export const getSchedule = () => API.get("/tutor/schedule");

export const getTutorProfile = () => API.get("/tutor/profile");

export const editTutorProfile = (data) => API.put("/tutor/profile", data);

export const uploadTutorProfilePic = (data) =>
  API.post("/tutor/profile/upload", data);

export const deleteTutorProfilePic = () =>
  API.delete("/tutor/profile/delete");

export const getTutorAvailability = (id) =>
  API.get(`/tutor/${id}/availability`);

export const saveTutorAvailability = (data) =>
  API.post("/tutor/availability", data);

export default API;
