import { BASE_URL } from "@/lib/base-url";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const registerNewCareCenter = async (data: NewCareCenterSchemaType) => {
  const { token } = useAuthStore.getState();
  try {
    const req = await axios.post(
      `${BASE_URL}/adoption/care-center/register`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return req.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
