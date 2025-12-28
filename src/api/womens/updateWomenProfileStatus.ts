import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const updateWomenProfileStatus = async ({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) => {
  const { token } = useAuthStore.getState();

  try {
    const req = await axios.patch(
      `${BASE_URL}/women/profiles/${id}/status`,
      { isActive },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return req.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update status";
    throw new Error(errorMessage);
  }
};
