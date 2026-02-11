import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import { CMSContent, CMSSettings, LandingPageData } from "@/types/cms";

const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getLandingPage = async (): Promise<LandingPageData> => {
  const res = await axios.get(`${BASE_URL}/public/landing`, getAuthHeader());
  return res.data;
};

export const updateCMSSettings = async (data: CMSSettings) => {
  const res = await axios.put(
    `${BASE_URL}/admin/cms/settings`,
    data,
    getAuthHeader(),
  );
  return res.data;
};

export const createCMSContent = async (data: CMSContent) => {
  const res = await axios.post(
    `${BASE_URL}/admin/cms/content`,
    data,
    getAuthHeader(),
  );
  return res.data;
};

export const updateCMSContent = async (id: number, data: CMSContent) => {
  const res = await axios.put(
    `${BASE_URL}/admin/cms/content/${id}`,
    data,
    getAuthHeader(),
  );
  return res.data;
};

export const deleteCMSContent = async (id: number) => {
  const res = await axios.delete(
    `${BASE_URL}/admin/cms/content/${id}`,
    getAuthHeader(),
  );
  return res.data;
};
