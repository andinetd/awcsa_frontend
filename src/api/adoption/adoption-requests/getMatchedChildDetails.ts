import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";

export const getMatchedChildDetails = async (id: number) => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/adoption/matches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
