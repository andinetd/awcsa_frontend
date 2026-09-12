import { useQuery } from "@tanstack/react-query";
import { searchPersons } from "@/api/persons/searchPersons";
import { getPersonHistory } from "@/api/persons/getPersonHistory";
import { PersonSearchParams } from "@/api/persons/types";

/**
 * Search across all registered persons.
 * Only fires when at least one of q, cityIdNumber, or faydaId is provided.
 */
export const usePersonSearch = (params: PersonSearchParams) =>
  useQuery({
    queryKey: ["persons", "search", params],
    queryFn: () => searchPersons(params),
    enabled: !!(params.q || params.cityIdNumber || params.faydaId),
  });

/**
 * Fetch the unified cross-department support history for a single person.
 */
export const usePersonHistory = (clientId?: number) =>
  useQuery({
    queryKey: ["persons", "history", clientId],
    queryFn: () => getPersonHistory(clientId!),
    enabled: !!clientId,
  });
