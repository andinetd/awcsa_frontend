import { useQuery } from "@tanstack/react-query";
import { getCareCenterReports } from "@/api/adoption/care-center/reports";

export const useCareCenterReports = () =>
  useQuery({
    queryKey: ["care-center-reports"],
    queryFn: getCareCenterReports,
  });
