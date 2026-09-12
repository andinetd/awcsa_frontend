import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { PersonSearchParams, PersonSearchResponse } from "./types";

export const searchPersons = async (
  params: PersonSearchParams
): Promise<PersonSearchResponse> => {
  const { token } = useAuthStore.getState();
  try {
    const response = await axios.get(`${BASE_URL}/persons/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to search persons";
    throw new Error(errorMessage);
  }
};
