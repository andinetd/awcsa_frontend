import { useQuery } from "@tanstack/react-query";
import { getChildWelfareDashboard } from "@/api/dashboard/child-welfare";

export const useChildWelfareDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "child-welfare"],
    queryFn: getChildWelfareDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
