import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export type AssociationReportFormat = "EXCEL" | "PDF";

const FILE_EXTENSIONS: Record<AssociationReportFormat, string> = {
  EXCEL: "xlsx",
  PDF: "pdf",
};

function triggerDownload(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const generateAssociationReport = async (payload: {
  associationId: number;
  format: AssociationReportFormat;
}) => {
  const sanitizedId = String(payload.associationId).replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );
  const fileName = `association-${sanitizedId}-${payload.format.toLowerCase()}.${FILE_EXTENSIONS[payload.format]}`;

  try {
    const { token } = useAuthStore.getState();

    const response = await axios.post(
      `${BASE_URL}/women-affairs/reports/association/${payload.associationId}`,
      { format: payload.format },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    const contentType = response.headers["content-type"] ?? "";
    const mimeType =
      contentType ||
      (payload.format === "EXCEL"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf");

    triggerDownload(new Blob([response.data], { type: mimeType }), fileName);

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to generate association report";
    throw new Error(errorMessage);
  }
};
