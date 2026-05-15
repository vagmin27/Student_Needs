import axios from "axios";
import { referralsApiClient as api } from "@/services/apiClient.js";

export const analyzeApi = {
  analyzeProfile: async (resume, linkedin, github_url, target_role) => {
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("linkedin", linkedin);
    formData.append("github_url", github_url);
    formData.append("target_role", target_role);

    try {
      const response = await api.post("/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
          );
        }

        if (error.request) {
          throw new Error("Network Error: No response from analyzer.");
        }
      }

      throw new Error(
        `Network Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
};
