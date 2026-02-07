import { useQuery } from "@tanstack/react-query";
import { getSocialRehabDashboard } from "@/api/dashboard/social-rehab";

export const useSocialRehabDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "social-rehab"],
    queryFn: getSocialRehabDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
