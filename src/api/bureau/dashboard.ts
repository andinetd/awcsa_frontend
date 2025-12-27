import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface BureauDashboardSummary {
  totalFacilities: number;
  totalChildren: number;
  submittedReports: number;
  pendingReports: number;
}

export const getBureauDashboardSummary =
  async (): Promise<BureauDashboardSummary> => {
    const { token } = useAuthStore.getState();
    const res = await axios.get(`${BASE_URL}/bureau/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
