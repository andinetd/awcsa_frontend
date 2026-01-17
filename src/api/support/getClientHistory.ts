import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { SupportService } from "./support-service";

export const getClientHistory = async (
  clientId: number
): Promise<SupportService[]> => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.get(
      `${BASE_URL}/support/history/client/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch client history";
    throw new Error(errorMessage);
  }
};
