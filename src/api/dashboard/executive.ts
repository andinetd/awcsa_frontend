import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface RecentActivity {
  id: string;
  type:
    | "CLIENT_REGISTRATION"
    | "CHILD_REGISTRATION"
    | "FACILITY_REGISTRATION"
    | "EDIR_REGISTRATION";
  title: string;
  description: string;
  timestamp: string;
}

export interface ExecutiveDashboardStats {
  overview: {
    totalChildren: number;
    totalPeopleRegistered: number;
    totalFacilities: number;
    totalEdirs: number;
  };
  recentActivity: RecentActivity[];
}

export const getExecutiveDashboard =
  async (): Promise<ExecutiveDashboardStats> => {
    const { token } = useAuthStore.getState();
    const res = await axios.get(`${BASE_URL}/dashboard/executive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
