import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface GenerateReportPayload {
  startDate?: string;
  endDate?: string;
  subCity?: string;
  woreda?: string;
  selectedColumns?: string[];
  format: "EXCEL" | "PDF";
}

export const generateEdirReport = async (payload: GenerateReportPayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/edir/reports/generate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for file download
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
