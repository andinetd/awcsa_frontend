import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface RegisterWomenProfilePayload {
  cityIdNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  educationLevel: string;
  occupation: string;
  monthlyIncome: number;
  photoUrl?: string;
}

export const registerWomenProfile = async (
  data: RegisterWomenProfilePayload
) => {
  const { token } = useAuthStore.getState();

  try {
    const req = await axios.post(`${BASE_URL}/women/profiles/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return req.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to register profile";
    throw new Error(errorMessage);
  }
};
