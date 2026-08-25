import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export type WomenReportCategory =
  | "SUPPORT_SERVICE"
  | "TECHNOLOGY_SUPPORT"
  | "TRAINING"
  | "EMPLOYMENT"
  | "ASSOCIATION";

export interface GenerateWomenReportPayload {
  category?: WomenReportCategory;
  startDate?: string;
  endDate?: string;
  subCity?: string;
  woreda?: string;
  serviceTypeId?: number;
  beneficiaryLevel?: "INDIVIDUAL" | "ASSOCIATION";
  technologyType?: string;
  isPoor?: boolean;
  isSexWorker?: boolean;
  trainingTopic?: string;
  attended?: boolean;
  year?: string;
  employmentType?: "INDIVIDUAL" | "GROUP";
  sector?: string;
  associationType?: "ASSOCIATION" | "DEVELOPMENT_ASSOCIATION" | "FEDERATION";
  status?: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  selectedColumns?: string[];
  format: "EXCEL" | "PDF";
}

const FILE_PREFIXES: Record<WomenReportCategory, string> = {
  SUPPORT_SERVICE: "women_support_services_report",
  TECHNOLOGY_SUPPORT: "women_technology_support_report",
  TRAINING: "women_training_report",
  EMPLOYMENT: "women_employment_report",
  ASSOCIATION: "women_associations_report",
};

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
    const prefix = FILE_PREFIXES[payload.category ?? "SUPPORT_SERVICE"];
    const fileName = `${prefix}_${
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
