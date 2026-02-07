import { useQuery } from "@tanstack/react-query";
import { getExecutiveDashboard } from "@/api/dashboard/executive";

export const useExecutiveDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "executive"],
    queryFn: getExecutiveDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
