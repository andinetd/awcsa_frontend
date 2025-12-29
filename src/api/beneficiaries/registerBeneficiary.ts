import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { RegistrationPayload } from "./types";

export const registerBeneficiary = async (
  registrationData: RegistrationPayload
) => {
  const { token } = useAuthStore.getState();
  const { type, ...data } = registrationData;
  const endpoint = type === "DISABLED" ? "disabled" : "elderly";

  // Sanitize payload based on type
  const payload =
    type === "ELDERLY"
      ? {
          cityIdNumber: data.cityIdNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          educationLevel: data.educationLevel,
          occupation: data.occupation,
          familyMembersCount: data.familyMembersCount,
        }
      : data;

  try {
    const response = await axios.post(
      `${BASE_URL}/beneficiaries/${endpoint}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || `Failed to register ${type} beneficiary`
    );
  }
};
