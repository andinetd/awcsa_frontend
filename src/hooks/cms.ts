import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLandingPage,
  updateCMSSettings,
  createCMSContent,
  updateCMSContent,
  deleteCMSContent,
} from "@/api/super-admin/cms";
import { CMSContent, CMSSettings } from "@/types/cms";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useGetLandingPage = () => {
  return useQuery({
    queryKey: ["landingPage"],
    queryFn: getLandingPage,
  });
};

export const useUpdateCMSSettings = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.cms.messages");
  return useMutation({
    mutationFn: (data: CMSSettings) => updateCMSSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      toast.success(t("settingsUpdateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("settingsUpdateError"));
    },
  });
};

export const useCreateCMSContent = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.cms.messages");
  return useMutation({
    mutationFn: (data: CMSContent) => createCMSContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      toast.success(t("contentCreateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("contentCreateError"));
    },
  });
};

export const useUpdateCMSContent = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.cms.messages");
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CMSContent }) =>
      updateCMSContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      toast.success(t("contentUpdateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("contentUpdateError"));
    },
  });
};

export const useDeleteCMSContent = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("super-admin.cms.messages");
  return useMutation({
    mutationFn: (id: number) => deleteCMSContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage"] });
      toast.success(t("contentDeleteSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("contentDeleteError"));
    },
  });
};
