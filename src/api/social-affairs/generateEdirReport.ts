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

  // If dates are omitted by the user, provide default range from 1970 to now
  const cleanPayload = {
    ...payload,
    startDate: payload.startDate || "1970-01-01",
    endDate: payload.endDate || new Date().toISOString().split("T")[0],
    selectedColumns: (payload.selectedColumns || []).filter((c) => c !== "members"),
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/edir/reports/generate`,
      cleanPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Important for file download
      }
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.message || "Failed to generate report");
      } catch (e: any) {
        if (e.message && e.message !== "Failed to generate report") {
          throw new Error(e.message);
        }
      }
    }
    throw new Error(
      error?.response?.data?.message || error?.message || "Failed to generate report"
    );
  }
};
