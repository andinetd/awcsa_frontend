import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface ChildWelfareDashboardStats {
  children: {
    total: number;
    found: number;
    inCare: number;
    adopted: number;
    fostered: number;
  };
  adoption: {
    totalApplicants: number;
  };
  infrastructure: {
    totalFacilities: number;
    reports: Array<{
      _count: number;
      status: string;
    }>;
  };
}

export const getChildWelfareDashboard =
  async (): Promise<ChildWelfareDashboardStats> => {
    const { token } = useAuthStore.getState();
    const res = await axios.get(`${BASE_URL}/dashboard/child-welfare`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
