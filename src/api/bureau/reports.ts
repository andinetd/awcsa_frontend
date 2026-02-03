import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface BureauReportFilters {
  month?: number;
  year?: number;
  subCity?: string;
  facilityId?: number;
}

export interface BureauReport {
  id: number;
  facilityId: number;
  month: number;
  year: number;
  totalChildren: number;
  newAdmissions: number;
  discharges: number;
  notes: string | null;
  formData: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  facility: {
    id: number;
    name: string;
    subCity: string;
    region: string;
  };
}

export const getBureauReports = async (filters: BureauReportFilters) => {
  const { token } = useAuthStore.getState();
  // Using 'params' to automatically construct the query string
  const res = await axios.get(`${BASE_URL}/bureau/dashboard/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters,
  });
  return res.data;
};
