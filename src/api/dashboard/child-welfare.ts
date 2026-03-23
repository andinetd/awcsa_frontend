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

    const data = res.data || {};
    return {
      children: {
        total: data.children?.total || 0,
        found: data.children?.found || 0,
        inCare: data.children?.inCare || 0,
        adopted: data.children?.adopted || 0,
        fostered: data.children?.fostered || 0,
      },
      adoption: {
        totalApplicants: data.adoption?.totalApplicants || 0,
      },
      infrastructure: {
        totalFacilities: data.infrastructure?.totalFacilities || 0,
        reports: Array.isArray(data.infrastructure?.reports)
          ? data.infrastructure.reports
          : [],
      },
    };
  };
