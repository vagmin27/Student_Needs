import { toast } from "react-hot-toast";

export const setupInterceptors = (axiosInstance) => {
  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // In a real app, retrieve JWT from localStorage if needed (Expenses uses 'User' object)
      const userData = localStorage.getItem("User");
      if (userData) {
        try {
          const { token } = JSON.parse(userData);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.warn("Failed to parse User token from localStorage");
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Standardize 401 Unauthorized handling
      if (error.response?.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        // Optional: Trigger a centralized logout or redirect here
      } else if (error.response?.status >= 500) {
        toast.error("A server error occurred. Please try again later.");
      }
      
      return Promise.reject(error);
    }
  );
};
