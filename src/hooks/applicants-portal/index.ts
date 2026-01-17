import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { authMe } from "@/api/applicants-portal/authMe";
import { fetchApplication } from "@/api/applicants-portal/fetchApplication";
import { useAuthStore } from "@/stores/auth-store";
import { submitApplication } from "@/api/applicants-portal/submitApplication";
import { toast } from "sonner";

export const useAuthMeQuery = () => {
  const { token } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  // Clear cached auth/me when token is removed (e.g., logout)
  useEffect(() => {
    if (!token) {
      try {
        queryClient.removeQueries({ queryKey: ["auth", "me"] });
      } catch (e) {
        // ignore
      }
    }
  }, [token, queryClient]);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export const useFetchApplicationQuery = () => {
  const { token } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  // Clear cached application when token is removed (e.g., logout)
  useEffect(() => {
    if (!token) {
      try {
        queryClient.removeQueries({ queryKey: ["applicants-portal", "application"] });
      } catch (e) {
        // ignore
      }
    }
  }, [token, queryClient]);

  return useQuery({
    queryKey: ["applicants-portal", "application"],
    queryFn: fetchApplication,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export const useSubmitApplicationMutation = () => {
 return useMutation({
   mutationKey: ["submit-application"],
   mutationFn: submitApplication,
 });
}