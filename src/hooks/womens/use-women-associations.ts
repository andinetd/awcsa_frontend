import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWomenAssociations,
  getWomenAssociationById,
  registerWomenAssociation,
  updateWomenAssociation,
  deleteWomenAssociation,
  saveWomenAssociationMembers,
  uploadAssociationDocument,
  submitAssociation,
  reviewAssociation,
  getAssociationGroups,
  addAssociationGroup,
  renameAssociationGroup,
  deleteAssociationGroup,
  listMembers,
  updateMember,
  moveMember,
  deleteMember,
  checkMemberDuplicate,
  getAssociationDashboard,
  CreateWomenAssociationPayload,
  UpdateWomenAssociationPayload,
  WomenAssociationMember,
  WomenAssociationDocumentType,
} from "@/api/womens/associations";

// ─── Associations ──────────────────────────────────────────────

export const useGetWomenAssociationsQuery = (params?: {
  search?: string;
  subCity?: string;
  woreda?: string;
}) => {
  return useQuery({
    queryKey: ["women-associations", params],
    queryFn: () => getWomenAssociations(params),
  });
};

export const useGetWomenAssociationByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-association", id],
    queryFn: () => getWomenAssociationById(id),
    enabled: !!id,
  });
};

export const useRegisterWomenAssociationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWomenAssociationPayload) =>
      registerWomenAssociation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-associations"] });
    },
  });
};

export const useUpdateWomenAssociationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateWomenAssociationPayload }) =>
      updateWomenAssociation(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-associations"] });
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

export const useDeleteWomenAssociationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWomenAssociation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-associations"] });
    },
  });
};

export const useSaveAssociationMembersMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: number;
      members: Omit<WomenAssociationMember, "id" | "associationId">[];
    }) => saveWomenAssociationMembers(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

export const useUploadAssociationDocumentMutation = () => {
  return useMutation({
    mutationFn: (payload: { file: File; type: WomenAssociationDocumentType }) =>
      uploadAssociationDocument(payload.file, payload.type),
  });
};

export const useSubmitAssociationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: number;
      enteredByName: string;
      entrySignatureDocId?: number;
    }) => submitAssociation(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-associations"] });
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

export const useReviewAssociationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: number;
      decision: "APPROVED" | "REJECTED";
      approvedByName: string;
      approvalSignatureDocId?: number;
      rejectionReason?: string;
    }) => reviewAssociation(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-associations"] });
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

// ─── Groups ────────────────────────────────────────────────────

export const useGetAssociationGroupsQuery = (associationId: number) => {
  return useQuery({
    queryKey: ["women-association-groups", associationId],
    queryFn: () => getAssociationGroups(associationId),
    enabled: !!associationId,
  });
};

export const useAddAssociationGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; groupNumber: number; name?: string }) =>
      addAssociationGroup(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["women-association-groups", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

export const useRenameAssociationGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: number;
      groupId: number;
      name: string | null;
    }) => renameAssociationGroup(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["women-association-groups", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

export const useDeleteAssociationGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; groupId: number }) =>
      deleteAssociationGroup(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["women-association-groups", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["women-association", variables.id],
      });
    },
  });
};

// ─── Members (cross-association) ───────────────────────────────

export const useListMembersQuery = (params?: {
  search?: string;
  phone?: string;
  associationId?: number;
  groupId?: number;
  subCity?: string;
  woreda?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["women-members", params],
    queryFn: () => listMembers(params),
  });
};

export const useUpdateMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; fullName: string; phoneNumber?: string }) =>
      updateMember(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-members"] });
      queryClient.invalidateQueries({
        queryKey: ["women-association-members", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["women-association"] });
    },
  });
};

export const useMoveMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: number;
      toGroupId: number;
      toSerialNumber: number;
    }) => moveMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-members"] });
      queryClient.invalidateQueries({ queryKey: ["women-association"] });
    },
  });
};

export const useDeleteMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-members"] });
      queryClient.invalidateQueries({ queryKey: ["women-association"] });
    },
  });
};

export const useCheckMemberDuplicateMutation = () => {
  return useMutation({
    mutationFn: (payload: {
      phone: string;
      associationId: number;
      excludeMemberId?: number;
    }) => checkMemberDuplicate(payload),
  });
};

// ─── Dashboard & Audit (FR-12 / FR-16) ─────────────────────────

export const useGetAssociationDashboardQuery = (params?: {
  subCity?: string;
  woreda?: string;
}) => {
  return useQuery({
    queryKey: ["women-association-dashboard", params],
    queryFn: () => getAssociationDashboard(params),
  });
};
