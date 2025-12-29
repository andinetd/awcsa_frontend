import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { BeneficiaryReportPayload } from "./types";

export const generateBeneficiaryReport = async (
  data: BeneficiaryReportPayload
) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/beneficiaries/reports/generate`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Set file name based on format
    const extension = data.format === "EXCEL" ? "xlsx" : "pdf";
    link.setAttribute(
      "download",
      `beneficiary-report-${new Date().getTime()}.${extension}`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to generate report"
    );
  }
};
