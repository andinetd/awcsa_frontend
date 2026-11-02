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
    let token = useAuthStore.getState().token;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)wcasf_auth_token=([^;]*)/);
      if (match) token = decodeURIComponent(match[1]);
    }

    const res = await axios.get(`${BASE_URL}/bureau/dashboard/summary`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.data;
  };
