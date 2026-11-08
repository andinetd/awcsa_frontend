import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { SupportService } from "./support-service";

export const getSupportRecords = async (): Promise<SupportService[]> => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.get(`${BASE_URL}/support`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch support records";
    throw new Error(errorMessage);
  }
};
