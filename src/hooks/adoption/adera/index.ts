import { registerAdera } from "@/api/adoption/adera/registerAdera";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRegisterAderaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAdera,
    mutationKey: ["Register adera"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Get All Adera"] });
    },
  });
};
