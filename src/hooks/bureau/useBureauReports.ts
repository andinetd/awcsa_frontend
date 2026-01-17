import { useQuery } from "@tanstack/react-query";
import { getBureauReports, BureauReportFilters } from "@/api/bureau/reports";

export const useBureauReports = (
  filters: BureauReportFilters,
  enabled: boolean = false
) =>
  useQuery({
    queryKey: ["bureau-reports", filters],
    queryFn: () => getBureauReports(filters),
    enabled: enabled, // Only run when enabled (e.g., when search button is clicked)
  });
