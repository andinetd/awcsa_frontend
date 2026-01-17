import { useQuery } from "@tanstack/react-query";
import { getCareCenterChildren } from "@/api/adoption/care-center/children";

export const useCareCenterChildren = (facilityId: number | undefined) =>
  useQuery({
    queryKey: ["care-center-children", facilityId],
    queryFn: () => getCareCenterChildren(facilityId!),
    enabled: !!facilityId,
  });
