import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getMatchedChildDetails } from "@/api/adoption/adoption-requests/getMatchedChildDetails";

export const useGetMatchedChildDetails = (id: number) => {
  const { token } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["application", "child-details", id],
    queryFn: getMatchedChildDetails.bind(null, id),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
