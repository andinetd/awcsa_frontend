import { useQuery } from "@tanstack/react-query";
import { getChildren } from "@/api/adoption/children";

export const useChildren = () =>
  useQuery({
    queryKey: ["adoption-children"],
    queryFn: () => getChildren(),
  });
