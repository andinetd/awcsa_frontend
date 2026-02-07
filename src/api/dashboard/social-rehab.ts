import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

export interface SocialRehabDashboardStats {
  beneficiaries: {
    totalVulnerable: number;
    elderly: number;
    disability: number;
    women: number;
  };
  community: {
    totalEdirs: number;
    totalMembers: number;
  };
  support: {
    totalServicesProvided: number;
  };
}

export const getSocialRehabDashboard =
  async (): Promise<SocialRehabDashboardStats> => {
    const { token } = useAuthStore.getState();
    const res = await axios.get(`${BASE_URL}/dashboard/social-rehab`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
