import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const getEdirAssociationById = async (id: number) => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(`${BASE_URL}/edir/associations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
