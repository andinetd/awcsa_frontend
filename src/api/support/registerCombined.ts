import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface RegisterCombinedPayload {
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  educationLevel: string;
  occupation: string;
  serviceTypeId: number;
  provider: string;
  amountOrQuantity: string;
  dateProvided: string;
  subCity: string;
  woreda: string;
  facilitatorCityId: string;
  remark: string;
}

export const registerCombined = async (data: RegisterCombinedPayload) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.post(
      `${BASE_URL}/support/register-combined`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to register combined service";
    throw new Error(errorMessage);
  }
};
