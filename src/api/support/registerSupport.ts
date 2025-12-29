import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface RegisterSupportPayload {
  serviceTypeId: number;
  clientId?: number;
  womenAssociationId?: number;
  provider: string;
  amountOrQuantity: string;
  dateProvided: string;
  facilitatorCityId: string;
  subCity: string;
  woreda: string;
  remark: string;
}

export const registerSupport = async (data: RegisterSupportPayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(`${BASE_URL}/support/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to register support service";
    throw new Error(errorMessage);
  }
};
