import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getMatchedChildDetails } from "@/api/adoption/adoption-requests/getMatchedChildDetails";
import {
  getAdoptionApplications,
  BackendAdoptionApplication,
} from "@/api/adoption/adoption-requests/getAdoptionApplications";

export const useAdoptionApplicationsQuery = (status = "ALL") => {
  const token = useAuthStore((state) => state.token);

  return useQuery<BackendAdoptionApplication[]>({
    queryKey: ["adoption", "applications", status],
    queryFn: () => getAdoptionApplications(status),
    enabled: !!token,
    staleTime: 60 * 1000, // 1 minute fresh cache
  });
};

export const useAdoptionApplicationById = (id: number) => {
  const { data: applications, isLoading, isError, refetch } = useAdoptionApplicationsQuery("ALL");

  const application = applications?.find((app) => app.applicationId === id) || null;

  return {
    data: application,
    isLoading,
    isError,
    refetch,
  };
};

export const useGetMatchedChildDetails = (id: number) => {
  const { token } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["application", "child-details", id],
    queryFn: getMatchedChildDetails.bind(null, id),
    enabled: !!token && !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
