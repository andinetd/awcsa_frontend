import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";

export const fetchApplication = async () => {
  const { token } = useAuthStore.getState();
  const res = await axios.get(`${BASE_URL}/public/adoption/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
