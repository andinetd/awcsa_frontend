import {
  fetchAllComplaints,
  fetchComplaintById,
  fetchMyComplaints,
  resolveComplaint,
  submitComplaint,
} from "@/api/complaints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSubmitComplaintMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints", "my"] });
      toast.success("Complaint submitted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to submit complaint",
      );
    },
  });
};

export const useMyComplaintsQuery = () => {
  return useQuery({
    queryKey: ["complaints", "my"],
    queryFn: fetchMyComplaints,
  });
};

export const useAllComplaintsQuery = () => {
  return useQuery({
    queryKey: ["complaints", "admin", "all"],
    queryFn: fetchAllComplaints,
  });
};

export const useComplaintDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["complaints", "admin", id],
    queryFn: () => fetchComplaintById(id),
    enabled: !!id,
  });
};

export const useResolveComplaintMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resolveComplaint,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["complaints", "admin", "all"],
      });
      queryClient.invalidateQueries({
        queryKey: ["complaints", "admin", variables.id],
      });
      toast.success("Complaint status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update complaint status",
      );
    },
  });
};
