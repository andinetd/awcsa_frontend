import { registerNewCareCenter } from "@/api/adoption/care-center/registerNewCenter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
