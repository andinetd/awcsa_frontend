import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { Beneficiary } from "./types";

export const getBeneficiaryProfile = async (
  id: number
): Promise<Beneficiary> => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.get(
      `${BASE_URL}/beneficiaries/profile/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch beneficiary profile"
    );
  }
};
