import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export interface UpdateWomenProfilePayload {
  cityIdNumber?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  educationLevel?: string;
  occupation?: string;
  monthlyIncome?: number;
  photoUrl?: string;
}

export const updateWomenProfile = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateWomenProfilePayload;
}) => {
  const { token } = useAuthStore.getState();

  try {
    const req = await axios.patch(`${BASE_URL}/women/profiles/${id}`, data, {
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
      "Failed to update profile";
    throw new Error(errorMessage);
  }
};
