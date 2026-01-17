import { BASE_URL } from "@/lib/base-url";
import { NewEdirSchemaType } from "@/schemas/edir";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const updateEdirAssociation = async ({
  id,
  data,
}: {
  id: number;
  data: any; // Using any to accommodate the flat structure expected by backend
}) => {
  const { token } = useAuthStore.getState();
  try {
    const req = await axios.patch(`${BASE_URL}/edir/associations/${id}`, data, {
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
