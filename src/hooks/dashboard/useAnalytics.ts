import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "@/api/dashboard/analytics";

export const useGetDashboardAnalyticsQuery = () => {
  return useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: getDashboardAnalytics,
  });
};
