import { useQuery } from "@tanstack/react-query";
import { authMe } from "@/api/applicants-portal/authMe";
import { fetchApplication } from "@/api/applicants-portal/fetchApplication";
import { useAuthStore } from "@/stores/auth-store";

export const useAuthMeQuery = () => {
  const { token } = useAuthStore((state) => state);

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

  return useQuery({
    queryKey: ["applicants-portal", "application"],
    queryFn: fetchApplication,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}