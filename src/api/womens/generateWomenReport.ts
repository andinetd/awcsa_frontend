import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface GenerateWomenReportPayload {
  startDate?: string;
  endDate?: string;
  subCity?: string;
  woreda?: string;
  serviceTypeId?: number;
  beneficiaryLevel?: "INDIVIDUAL" | "GROUP";
  selectedColumns?: string[];
  format: "EXCEL" | "PDF";
}

export const generateWomenReport = async (
  payload: GenerateWomenReportPayload
) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/women-affairs/reports/generate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    const fileExtension = payload.format === "EXCEL" ? "xlsx" : "pdf";
    const fileName = `women_support_services_report_${
      new Date().toISOString().split("T")[0]
    }.${fileExtension}`;

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to generate report";
    throw new Error(errorMessage);
  }
};
