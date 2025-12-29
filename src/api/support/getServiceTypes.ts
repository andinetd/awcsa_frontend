import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { ServiceType } from "./support-service";

export const getServiceTypes = async (): Promise<ServiceType[]> => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.get(`${BASE_URL}/support/types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch service types";
    throw new Error(errorMessage);
  }
};
