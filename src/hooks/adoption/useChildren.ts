import { useQuery } from "@tanstack/react-query";
import { getChildren, getChildrenByStatus } from "@/api/adoption/children";
import { Child } from "@/types/child-matching-types";

export const useChildren = () =>
  useQuery<Child[]>({
    queryKey: ["adoption-children"],
    queryFn: () => getChildren(),
    staleTime: 60 * 1000,
  });

export const useChildrenByStatus = (status: string) =>
  useQuery<Child[]>({
    queryKey: ["adoption-children", "status", status],
    queryFn: () => getChildrenByStatus(status),
    enabled: !!status,
    staleTime: 60 * 1000,
  });
