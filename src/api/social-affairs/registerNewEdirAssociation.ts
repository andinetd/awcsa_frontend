import { BASE_URL } from "@/lib/base-url";
import { NewEdirSchemaType } from "@/schemas/edir";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const registerNewEdirAssociation = async (data: NewEdirSchemaType) => {
  const { token } = useAuthStore.getState();
  try {
    const req = await axios.post(`${BASE_URL}/edir/associations`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return req.data;
  } catch (error) {
    throw new Error(error as any);
  }
};
