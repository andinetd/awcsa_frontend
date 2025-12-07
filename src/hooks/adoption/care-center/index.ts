import { getCareCenters } from "@/api/adoption/care-center/getCareCenters";
import { registerNewCareCenter } from "@/api/adoption/care-center/registerNewCenter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCareCentersQuery = () => {
  return useQuery({
    queryFn: getCareCenters,
    queryKey: ["Get All Centers"],
  });
};

export const useRegisterCareCenterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerNewCareCenter,
    mutationKey: ["Register Care Center"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Get All Centers"] });
    },
  });
};
