import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { JobPayload, JobPlacement } from "./types";

export const getJobs = async (cityId?: string) => {
  const { token } = useAuthStore.getState();
  const url = `${BASE_URL}/disability-elderly/history/jobs`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: cityId ? { cityId } : undefined,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch job placements",
    );
  }
};

export const registerJob = async (data: JobPayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/disability-elderly/job`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to register job placement",
    );
  }
};
