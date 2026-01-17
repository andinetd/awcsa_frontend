import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServiceTypes } from "@/api/support/getServiceTypes";
import {
  registerSupport,
  RegisterSupportPayload,
} from "@/api/support/registerSupport";
import {
  addMonitoring,
  AddMonitoringPayload,
} from "@/api/support/addMonitoring";
import { getClientHistory } from "@/api/support/getClientHistory";
import { getAssociationHistory } from "@/api/support/getAssociationHistory";
import { getSupportById } from "@/api/support/getSupportById";
import {
  registerCombined,
  RegisterCombinedPayload,
} from "@/api/support/registerCombined";

// Query: Get service types
export const useGetServiceTypesQuery = () => {
  return useQuery({
    queryKey: ["service-types"],
    queryFn: getServiceTypes,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Query: Get client support history
export const useGetClientHistoryQuery = (clientId: number) => {
  return useQuery({
    queryKey: ["support-history", "client", clientId],
    queryFn: () => getClientHistory(clientId),
    enabled: !!clientId,
  });
};

// Query: Get association support history
export const useGetAssociationHistoryQuery = (associationId: number) => {
  return useQuery({
    queryKey: ["support-history", "association", associationId],
    queryFn: () => getAssociationHistory(associationId),
    enabled: !!associationId,
  });
};

// Query: Get support service by ID
export const useGetSupportByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["support-service", id],
    queryFn: () => getSupportById(id),
    enabled: !!id,
  });
};

// Mutation: Register support service
export const useRegisterSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerSupport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-history"] });
    },
  });
};

// Mutation: Add monitoring entry
export const useAddMonitoringMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMonitoring,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-service", variables.supportRecordId],
      });
    },
  });
};

// Mutation: Register combined (client + support)
export const useRegisterCombinedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterCombinedPayload) => registerCombined(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-history"] });
      queryClient.invalidateQueries({ queryKey: ["women-profiles"] });
    },
  });
};
