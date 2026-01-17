import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWomenProfiles } from "@/api/womens/getWomenProfiles";
import { getWomenProfileById } from "@/api/womens/getWomenProfileById";
import {
  registerWomenProfile,
  RegisterWomenProfilePayload,
} from "@/api/womens/registerWomenProfile";
import {
  updateWomenProfile,
  UpdateWomenProfilePayload,
} from "@/api/womens/updateWomenProfile";
import { updateWomenProfileStatus } from "@/api/womens/updateWomenProfileStatus";
import {
  generateWomenReport,
  GenerateWomenReportPayload,
} from "@/api/womens/generateWomenReport";

export const useGetWomenProfilesQuery = () => {
  return useQuery({
    queryKey: ["women-profiles"],
    queryFn: getWomenProfiles,
  });
};

export const useGetWomenProfileByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-profile", id],
    queryFn: () => getWomenProfileById(id),
    enabled: !!id,
  });
};

export const useRegisterWomenProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterWomenProfilePayload) =>
      registerWomenProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-profiles"] });
    },
  });
};

export const useUpdateWomenProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateWomenProfilePayload }) =>
      updateWomenProfile(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-profiles"] });
      queryClient.invalidateQueries({
        queryKey: ["women-profile", variables.id],
      });
    },
  });
};

export const useUpdateWomenProfileStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number; isActive: boolean }) =>
      updateWomenProfileStatus(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-profiles"] });
      queryClient.invalidateQueries({
        queryKey: ["women-profile", variables.id],
      });
    },
  });
};

export const useGenerateWomenReportMutation = () => {
  return useMutation({
    mutationFn: (payload: GenerateWomenReportPayload) =>
      generateWomenReport(payload),
  });
};
