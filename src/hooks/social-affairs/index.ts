import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { registerNewEdirAssociation } from "@/api/social-affairs/registerNewEdirAssociation";
import { getEdirAssociations } from "@/api/social-affairs/getEdirAssociations";
import { getEdirAssociationById } from "@/api/social-affairs/getEdirAssociationById";
import { updateEdirAssociation } from "@/api/social-affairs/updateEdirAssociation";
import { importEdirAssociations } from "@/api/social-affairs/importEdirAssociations";
import { importEdirMembers } from "@/api/social-affairs/importEdirMembers";
import { generateEdirReport } from "@/api/social-affairs/generateEdirReport";
import {
  getEdirMembers,
  addEdirMember,
  getEdirMemberById,
  updateEdirMember,
} from "@/api/social-affairs/member-api";
import {
  renewEdirAssociation,
  cancelEdirAssociation,
  reissueEdirCertificate,
  uploadEdirDocument,
} from "@/api/social-affairs/accreditation-api";
import {
  getEdirCouncils,
  getEdirCouncilById,
  registerEdirCouncil,
  updateEdirCouncil,
  renewEdirCouncil,
  cancelEdirCouncil,
  addEdirsToCouncil,
  removeEdirFromCouncil,
  getEdirsForCouncilSelection,
} from "@/api/social-affairs/council-api";
import { EdirCancellationReason, EdirLevel, EdirStatus } from "@/api/social-affairs/edir";

export const useImportEdirAssociationsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importEdirAssociations(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
    },
  });
};

export const useImportEdirMembersMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importEdirMembers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edir-members"] });
    },
  });
};

import { GenerateReportPayload } from "@/api/social-affairs/generateEdirReport"; 

export const useGenerateEdirReportMutation = () => {
  return useMutation({
    mutationFn: (payload: GenerateReportPayload) => generateEdirReport(payload),
  });
};
import {
  CreateEdirMemberPayload,
  UpdateEdirMemberPayload,
} from "@/api/social-affairs/member-types";

export const useGetEdirMembersQuery = (associationId: number) => {
  return useQuery({
    queryKey: ["edir-members", associationId],
    queryFn: () => getEdirMembers(associationId),
    enabled: !!associationId,
  });
};

export const useAddEdirMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEdirMemberPayload) => addEdirMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["edir-members", variables.associationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["edir-association", variables.associationId],
      });
    },
  });
};

export const useGetEdirMemberByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["edir-member", id],
    queryFn: () => getEdirMemberById(id),
    enabled: !!id,
  });
};

export const useUpdateEdirMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateEdirMemberPayload }) =>
      updateEdirMember(payload),
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({
        queryKey: ["edir-members", updatedMember.associationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["edir-member", updatedMember.id],
      });
    },
  });
};

export const useGetEdirAssociationsQuery = () => {
  return useQuery({
    queryKey: ["edir-associations"],
    queryFn: getEdirAssociations,
  });
};

export const useGetEdirAssociationByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["edir-association", id],
    queryFn: () => getEdirAssociationById(id),
    enabled: !!id,
  });
};

export const useCreateEdirMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerNewEdirAssociation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
    },
  });
};

export const useUpdateEdirMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEdirAssociation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
      queryClient.invalidateQueries({
        queryKey: ["edir-association", variables.id],
      });
    },
  });
};

export const useRenewEdirMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renewEdirAssociation,
    onSuccess: (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
      queryClient.invalidateQueries({ queryKey: ["edir-association", variables.id] });
    },
  });
};

export const useCancelEdirMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelEdirAssociation,
    onSuccess: (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
      queryClient.invalidateQueries({ queryKey: ["edir-association", variables.id] });
    },
  });
};

export const useReissueEdirCertificateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reissueEdirCertificate,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
      queryClient.invalidateQueries({ queryKey: ["edir-association", updated.id] });
    },
  });
};

export const useUploadEdirDocumentMutation = () => {
  return useMutation({
    mutationFn: uploadEdirDocument,
  });
};

export const useGetEdirCouncilsQuery = (params?: {
  level?: EdirLevel;
  status?: EdirStatus | "ALL";
}) => {
  return useQuery({
    queryKey: ["edir-councils", params],
    queryFn: () => getEdirCouncils(params),
  });
};

export const useGetEdirCouncilByIdQuery = (councilId: number) => {
  return useQuery({
    queryKey: ["edir-council", councilId],
    queryFn: () => getEdirCouncilById(councilId),
    enabled: !!councilId,
  });
};

export const useCreateEdirCouncilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerEdirCouncil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] });
    },
  });
};

export const useUpdateEdirCouncilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEdirCouncil,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] });
      queryClient.invalidateQueries({
        queryKey: ["edir-council", variables.councilId],
      });
    },
  });
};

export const useRenewEdirCouncilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renewEdirCouncil,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] });
      queryClient.invalidateQueries({
        queryKey: ["edir-council", variables.councilId],
      });
    },
  });
};

export const useCancelEdirCouncilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelEdirCouncil,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] });
      queryClient.invalidateQueries({
        queryKey: ["edir-council", variables.councilId],
      });
    },
  });
};

export const useAddEdirsToCouncilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEdirsToCouncil,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] });
      queryClient.invalidateQueries({
        queryKey: ["edir-council", variables.councilId],
      });
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
    },
  });
};

export const useRemoveEdirFromCouncilMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeEdirFromCouncil,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] });
      queryClient.invalidateQueries({
        queryKey: ["edir-council", variables.councilId],
      });
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] });
    },
  });
};

export const useGetEdirsForCouncilSelectionQuery = (level?: EdirLevel) => {
  return useQuery({
    queryKey: ["edir-councils-available", level],
    queryFn: () => getEdirsForCouncilSelection(level || "WOREDA"),
    enabled: !!level,
  });
};
