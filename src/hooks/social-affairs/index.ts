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
import { EdirCancellationReason } from "@/api/social-affairs/edir";

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
