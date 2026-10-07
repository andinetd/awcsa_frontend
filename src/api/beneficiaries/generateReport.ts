import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { BeneficiaryReportPayload } from "./types";

export const generateBeneficiaryReport = async (
  data: BeneficiaryReportPayload
): Promise<Blob> => {
  const { token } = useAuthStore.getState();

  const cleanPayload = {
    ...data,
    startDate: data.startDate || undefined,
    endDate: data.endDate || undefined,
    subCity: data.subCity && data.subCity !== "ALL" ? data.subCity : undefined,
    woreda: data.woreda && data.woreda !== "ALL" ? data.woreda : undefined,
    category: data.category === "JOBS" ? "JOB" : data.category,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/beneficiaries/reports/generate`,
      cleanPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
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
