import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";

export const authMe = async () => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
}