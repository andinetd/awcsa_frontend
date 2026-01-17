import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const getCareCenters = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get(`${BASE_URL}/care-center/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
};
