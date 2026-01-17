import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface MonthlyReport {
  id: number;
  facilityId: number;
  month: number;
  year: number;
  totalChildren: number;
  newAdmissions: number;
  discharges: number;
  notes: string;
  formData: string;
  submittedAt: string | null;
  approvedAt: string | null;
  status: "SUBMITTED" | "DRAFT" | "APPROVED" | "REJECTED" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export const getCareCenterReports = async (): Promise<MonthlyReport[]> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/care-center/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
