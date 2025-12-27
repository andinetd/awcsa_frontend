import { useQuery } from "@tanstack/react-query";
import { getBureauDashboardSummary } from "@/api/bureau/dashboard";

export const useBureauDashboardSummary = () =>
  useQuery({
    queryKey: ["bureau-dashboard-summary"],
    queryFn: getBureauDashboardSummary,
  });
