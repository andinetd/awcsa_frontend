import { BASE_URL } from "@/lib/base-url";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const submitApplication = async (data: FormData) => {
  const { token } = useAuthStore.getState();

  const res = await axios.post(
    `${BASE_URL}/public/adoption/applications`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
