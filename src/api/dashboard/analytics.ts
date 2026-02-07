import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface AnalyticsData {
  trends: {
    month: string;
    registrations: number;
    activities: number;
  }[];
  demographics: {
    category: string;
    count: number;
    fill?: string;
  }[];
  performance: {
    department: string;
    output: number;
    efficiency: number;
  }[];
}

export const getDashboardAnalytics = async (): Promise<AnalyticsData> => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/dashboard/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
