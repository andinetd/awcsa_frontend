import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChildById,
  transferChildStatus,
  TransferChildStatusPayload,
  updateChild,
  createCarePlan,
  clearChildForAdoption,
  createSiblingGroup,
  addSiblingToGroup,
  removeSiblingFromGroup,
  upsertMedicalRecord,
  addDevelopmentMilestone,
  addGrowthPhoto,
  addFamilyTracingLog,
  registerChildBiometrics,
  getChildBiometrics,
  checkChildDuplicates,
  formalizeAderaCustody,
  getAderaCustody,
  recordAderaCheckup,
  convertAderaStatus,
  getFacilityCapacityOverview,
  conductFacilityCensusAudit,
} from "@/api/adoption/children";
import { toast } from "sonner";

export const useChildDetails = (id?: number | null) =>
  useQuery({
    queryKey: ["adoption-child", id],
    queryFn: () => getChildById(id!),
    enabled: typeof id === "number" && !isNaN(id) && id > 0,
  });

export const useTransferChildStatus = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransferChildStatusPayload) => {
      if (!childId) throw new Error("Child ID is required for status transfer");
      return transferChildStatus(childId, payload);
    },
    onSuccess: () => {
      toast.success("Child status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
      queryClient.invalidateQueries({ queryKey: ["care-center-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to transfer child status";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useUpdateChild = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, any>) => {
      if (!childId) throw new Error("Child ID is required to update child");
      return updateChild(childId, payload);
    },
    onSuccess: () => {
      toast.success("Child information updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
      queryClient.invalidateQueries({ queryKey: ["care-center-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update child record";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

// =====================================================================
// Care Plan Hooks
// =====================================================================

export const useCreateCarePlan = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      primaryGoal: string;
      secondaryGoal?: string;
      nextReviewDue: string;
      notes?: string;
      reunificationEffortDetails?: string;
    }) => {
      if (!childId) throw new Error("Child ID required");
      return createCarePlan(childId, payload);
    },
    onSuccess: () => {
      toast.success("Care plan created/updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create care plan";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useClearChildForAdoption = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      reunificationEffortDetails: string;
      courtOrderNumber?: string;
      clearedAt?: string;
      notes?: string;
    }) => {
      if (!childId) throw new Error("Child ID required");
      return clearChildForAdoption(childId, payload);
    },
    onSuccess: () => {
      toast.success("Child officially cleared for adoption!");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to clear child for adoption";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

// =====================================================================
// Sibling Group Hooks
// =====================================================================

export const useCreateSiblingGroup = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { childIds: number[]; notes?: string }) =>
      createSiblingGroup(payload),
    onSuccess: () => {
      toast.success("Sibling group linked successfully");
      if (childId) {
        queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      }
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create sibling group";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useAddSiblingToGroup = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      targetChildId,
    }: {
      groupId: number;
      targetChildId: number;
    }) => addSiblingToGroup(groupId, targetChildId),
    onSuccess: () => {
      toast.success("Sibling added to group successfully");
      if (childId) {
        queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      }
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add sibling";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useRemoveSiblingFromGroup = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      targetChildId,
    }: {
      groupId: number;
      targetChildId: number;
    }) => removeSiblingFromGroup(groupId, targetChildId),
    onSuccess: () => {
      toast.success("Sibling removed from group");
      if (childId) {
        queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      }
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove sibling";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

// =====================================================================
// Digital Dossier Hooks
// =====================================================================

export const useUpsertMedicalRecord = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      if (!childId) throw new Error("Child ID required");
      return upsertMedicalRecord(childId, payload);
    },
    onSuccess: () => {
      toast.success("Medical record saved successfully");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update medical record";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useAddDevelopmentMilestone = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      if (!childId) throw new Error("Child ID required");
      return addDevelopmentMilestone(childId, payload);
    },
    onSuccess: () => {
      toast.success("Development milestone recorded");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to record milestone";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useAddGrowthPhoto = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      if (!childId) throw new Error("Child ID required");
      return addGrowthPhoto(childId, payload);
    },
    onSuccess: () => {
      toast.success("Growth photo uploaded");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload photo";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useAddFamilyTracingLog = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      if (!childId) throw new Error("Child ID required");
      return addFamilyTracingLog(childId, payload);
    },
    onSuccess: () => {
      toast.success("Family tracing log added");
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add tracing log";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

// =====================================================================
// Biometrics & Identity Deduplication Hooks
// =====================================================================

export const useChildBiometrics = (childId?: number) => {
  return useQuery({
    queryKey: ["child-biometrics", childId],
    queryFn: () => {
      if (!childId) throw new Error("Child ID required");
      return getChildBiometrics(childId);
    },
    enabled: !!childId,
  });
};

export const useRegisterChildBiometrics = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      facialPhotoUrl: string;
      photoHash?: string;
      identifyingMarks?: any[];
      biometricConsent?: boolean;
    }) => {
      if (!childId) throw new Error("Child ID required");
      return registerChildBiometrics(childId, payload);
    },
    onSuccess: () => {
      toast.success("Child biometric profile saved");
      queryClient.invalidateQueries({ queryKey: ["child-biometrics", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save biometric record";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useCheckChildDuplicates = () => {
  return useMutation({
    mutationFn: (payload: {
      photoHash?: string;
      firstName?: string;
      estimatedAgeYears?: number;
      gender?: string;
    }) => checkChildDuplicates(payload),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to run deduplication check";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

// =====================================================================
// Adera Custody & Welfare Checkups Hooks
// =====================================================================

export const useAderaCustody = (childId?: number) => {
  return useQuery({
    queryKey: ["child-adera", childId],
    queryFn: () => {
      if (!childId) throw new Error("Child ID required");
      return getAderaCustody(childId);
    },
    enabled: !!childId,
  });
};

export const useFormalizeAderaCustody = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      custodianId: number;
      relationshipToChild?: string;
      reasonForAdera: string;
      custodyAgreementDocUrl?: string;
      monthlyStipend?: number;
      isCourtApproved?: boolean;
      nextCheckupDue?: string;
      notes?: string;
    }) => {
      if (!childId) throw new Error("Child ID required");
      return formalizeAderaCustody(childId, payload);
    },
    onSuccess: () => {
      toast.success("Adera custody arrangement formalized");
      queryClient.invalidateQueries({ queryKey: ["child-adera", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to formalize Adera custody";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useRecordAderaCheckup = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      visitDate?: string;
      livingConditionRating: string;
      safetyAssessment: string;
      childSchoolingStatus: string;
      childHealthStatus: string;
      riskFlags?: string[];
      socialWorkerRemarks: string;
      safetyRecommendation: string;
      nextCheckupDue?: string;
    }) => {
      if (!childId) throw new Error("Child ID required");
      return recordAderaCheckup(childId, payload);
    },
    onSuccess: () => {
      toast.success("Adera welfare checkup recorded");
      queryClient.invalidateQueries({ queryKey: ["child-adera", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to record checkup";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

export const useConvertAderaStatus = (childId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      targetStatus: string;
      notes?: string;
      courtOrderUrl?: string;
    }) => {
      if (!childId) throw new Error("Child ID required");
      return convertAderaStatus(childId, payload);
    },
    onSuccess: () => {
      toast.success("Adera status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["child-adera", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-child", childId] });
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to transition Adera status";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};

// =====================================================================
// Facility Capacity & Census Audit Hooks
// =====================================================================

export const useFacilityCapacityOverview = (facilityId?: number) => {
  return useQuery({
    queryKey: ["facility-capacity", facilityId],
    queryFn: () => {
      if (!facilityId) throw new Error("Facility ID required");
      return getFacilityCapacityOverview(facilityId);
    },
    enabled: !!facilityId,
  });
};

export const useConductFacilityCensusAudit = (facilityId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      physicalHeadcount: number;
      auditDate?: string;
      notes?: string;
      findings?: any;
    }) => {
      if (!facilityId) throw new Error("Facility ID required");
      return conductFacilityCensusAudit(facilityId, payload);
    },
    onSuccess: () => {
      toast.success("Physical census audit recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["facility-capacity", facilityId] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to record census audit";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
  });
};



