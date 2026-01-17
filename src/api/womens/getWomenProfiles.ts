import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const getWomenProfiles = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(`${BASE_URL}/women/profiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
