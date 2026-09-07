import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { ReportFilters } from "./types-v2";

export const generateBeneficiaryReportV2 = async (
  filters: ReportFilters
): Promise<Blob> => {
  const response = await axios.post(
    `${BASE_URL}/beneficiaries/reports/generate`,
    filters,
    {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob",
    }
  );
  return response.data;
};
