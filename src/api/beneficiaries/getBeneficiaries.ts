import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { Beneficiary, BeneficiaryType } from "./types";

export const getBeneficiaries = async (
  type: BeneficiaryType
): Promise<Beneficiary[]> => {
  const { token } = useAuthStore.getState();
  const endpoint = type === "DISABLED" ? "disabled" : "elderly";

  try {
    const response = await axios.get(`${BASE_URL}/beneficiaries/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Failed to fetch ${type} beneficiaries`
    );
  }
};
