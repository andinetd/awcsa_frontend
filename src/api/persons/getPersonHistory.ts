import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { PersonHistoryResponse } from "./types";

export const getPersonHistory = async (
  clientId: number
): Promise<PersonHistoryResponse> => {
  const { token } = useAuthStore.getState();
  try {
    const response = await axios.get(`${BASE_URL}/persons/${clientId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch person history";
    throw new Error(errorMessage);
  }
};
