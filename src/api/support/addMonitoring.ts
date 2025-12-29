import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface AddMonitoringPayload {
  supportRecordId: number;
  monitoringDate: string;
  assessedBy: string;
  currentStatus: string;
  score: number;
  remark: string;
}

export const addMonitoring = async (data: AddMonitoringPayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(`${BASE_URL}/support/monitoring`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to add monitoring entry";
    throw new Error(errorMessage);
  }
};
