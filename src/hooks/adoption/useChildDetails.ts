import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChildById,
  transferChildStatus,
  TransferChildStatusPayload,
} from "@/api/adoption/children";
import { toast } from "sonner";

export const useChildDetails = (id?: number | null) =>
  useQuery({
    queryKey: ["adoption-child", id],
    queryFn: () => getChildById(id!),
    enabled: typeof id === "number" && !isNaN(id) && id > 0,
  });

export const useTransferChildStatus = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransferChildStatusPayload) => {
      if (!childId) throw new Error("Child ID is required for status transfer");
      return transferChildStatus(childId, payload);
    },
    onSuccess: () => {
      toast.success("Child status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to transfer child status";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};
