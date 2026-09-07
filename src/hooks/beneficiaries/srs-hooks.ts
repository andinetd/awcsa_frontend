import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerElderlyBeneficiary,
  registerDisabledBeneficiary,
  searchBeneficiaries,
  getBeneficiaryByFayda,
  verifyFayda,
  getBeneficiaryDashboard,
  updateBeneficiaryProfile,
} from "@/api/beneficiaries/beneficiaries";
import {
  createEligibility,
  decideEligibility,
  listEligibility,
  listEligibilityForClient,
} from "@/api/beneficiaries/eligibility";
import {
  createServiceRequest,
  updateServiceStatus,
  confirmServiceRequest,
  listServiceRequests,
  getServiceRequest,
  listServiceRequestsForClient,
} from "@/api/beneficiaries/services-v2";
import {
  getCaseHistory,
  listBeneficiaryDocuments,
  uploadBeneficiaryDocument,
  listCaseNotes,
  addCaseNote,
} from "@/api/beneficiaries/case-history";
import {
  CreateElderlyPayload,
  CreateDisabledPayload,
  UpdateBeneficiaryPayload,
  BeneficiarySearchParams,
  CreateEligibilityPayload,
  DecideEligibilityPayload,
  CreateServiceRequestPayload,
  UpdateServiceStatusPayload,
  ConfirmServicePayload,
  CreateDocumentPayload,
  CreateCaseNotePayload,
} from "@/api/beneficiaries/types-v2";

export const useBeneficiarySearch = (params: BeneficiarySearchParams) =>
  useQuery({
    queryKey: ["beneficiaries", "search", params],
    queryFn: () => searchBeneficiaries(params),
    enabled: !!params.q || !!params.category || !!params.subCity || !!params.woreda || !!params.disabilityType,
  });

export const useBeneficiaryByFayda = (faydaId?: string) =>
  useQuery({
    queryKey: ["beneficiary", "fayda", faydaId],
    queryFn: () => getBeneficiaryByFayda(faydaId!),
    enabled: !!faydaId,
  });

export const useFaydaVerify = () =>
  useMutation({
    mutationFn: (faydaId: string) => verifyFayda(faydaId),
  });

export const useBeneficiaryDashboard = () =>
  useQuery({
    queryKey: ["beneficiaries", "dashboard"],
    queryFn: getBeneficiaryDashboard,
  });

export const useRegisterElderly = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateElderlyPayload) =>
      registerElderlyBeneficiary(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });
};

export const useRegisterDisabled = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDisabledPayload) =>
      registerDisabledBeneficiary(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });
};

export const useUpdateBeneficiary = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBeneficiaryPayload) =>
      updateBeneficiaryProfile(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["beneficiaries"] });
      qc.invalidateQueries({ queryKey: ["beneficiary"] });
      qc.invalidateQueries({ queryKey: ["case-history"] });
    },
  });
};

// Eligibility
export const useCreateEligibility = (clientId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEligibilityPayload) =>
      createEligibility(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["eligibility", clientId] });
      qc.invalidateQueries({ queryKey: ["case-history", clientId] });
    },
  });
};

export const useDecideEligibility = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      assessmentId,
      data,
    }: {
      assessmentId: number;
      data: DecideEligibilityPayload;
    }) => decideEligibility(assessmentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["eligibility"] });
    },
  });
};

export const useEligibilityList = () =>
  useQuery({
    queryKey: ["eligibility", "list"],
    queryFn: listEligibility,
  });

export const useEligibilityForClient = (clientId: number) =>
  useQuery({
    queryKey: ["eligibility", clientId],
    queryFn: () => listEligibilityForClient(clientId),
  });

// Service requests
export const useCreateServiceRequest = (clientId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceRequestPayload) =>
      createServiceRequest(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["case-history", clientId] });
    },
  });
};

export const useUpdateServiceStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateServiceStatusPayload;
    }) => updateServiceStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useConfirmService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ConfirmServicePayload;
    }) => confirmServiceRequest(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useServiceRequests = (filters: Parameters<typeof listServiceRequests>[0]) =>
  useQuery({
    queryKey: ["services", "list", filters],
    queryFn: () => listServiceRequests(filters),
  });

export const useServiceRequest = (id?: number) =>
  useQuery({
    queryKey: ["services", id],
    queryFn: () => getServiceRequest(id!),
    enabled: !!id,
  });

export const useServiceRequestsForClient = (clientId: number) =>
  useQuery({
    queryKey: ["services", "client", clientId],
    queryFn: () => listServiceRequestsForClient(clientId),
  });

// Case history / documents
export const useCaseHistory = (clientId: number) =>
  useQuery({
    queryKey: ["case-history", clientId],
    queryFn: () => getCaseHistory(clientId),
    enabled: !!clientId,
  });

export const useBeneficiaryDocuments = (clientId: number) =>
  useQuery({
    queryKey: ["documents", clientId],
    queryFn: () => listBeneficiaryDocuments(clientId),
    enabled: !!clientId,
  });

export const useUploadDocument = (clientId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocumentPayload) =>
      uploadBeneficiaryDocument(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents", clientId] });
    },
  });
};

export const useCaseNotes = (clientId: number) =>
  useQuery({
    queryKey: ["case-notes", clientId],
    queryFn: () => listCaseNotes(clientId),
    enabled: !!clientId,
  });

export const useAddCaseNote = (clientId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCaseNotePayload) => addCaseNote(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["case-notes", clientId] });
    },
  });
};
