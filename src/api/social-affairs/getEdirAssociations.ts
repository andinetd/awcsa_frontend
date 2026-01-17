import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const getEdirAssociations = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(`${BASE_URL}/edir/associations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
