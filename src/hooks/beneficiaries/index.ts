import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBeneficiaries } from "@/api/beneficiaries/getBeneficiaries";
import { registerBeneficiary } from "@/api/beneficiaries/registerBeneficiary";
import { getTrainings, registerTraining } from "@/api/beneficiaries/training";
import { getJobs, registerJob } from "@/api/beneficiaries/jobs";
import { getSupportServices } from "@/api/beneficiaries/services";
import { getBeneficiaryProfile } from "@/api/beneficiaries/getProfile";
import { generateBeneficiaryReport } from "@/api/beneficiaries/generateReport";
import { BeneficiaryType } from "@/api/beneficiaries/types";

export const useGetBeneficiariesQuery = (type: BeneficiaryType) => {
  return useQuery({
    queryKey: ["beneficiaries", type],
    queryFn: () => getBeneficiaries(type),
  });
};

export const useRegisterBeneficiaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerBeneficiary,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["beneficiaries", variables.type],
      });
    },
  });
};

export const useGetTrainingsQuery = (cityId?: string) => {
  return useQuery({
    queryKey: ["trainings", cityId],
    queryFn: () => getTrainings(cityId),
  });
};

export const useRegisterTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
    },
  });
};

export const useGetJobsQuery = (cityId?: string) => {
  return useQuery({
    queryKey: ["jobs", cityId],
    queryFn: () => getJobs(cityId),
  });
};

export const useRegisterJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useGetSupportServicesQuery = (cityId?: string) => {
  return useQuery({
    queryKey: ["support-services", cityId],
    queryFn: () => getSupportServices(cityId),
  });
};

export const useGetBeneficiaryProfileQuery = (id: number) => {
  return useQuery({
    queryKey: ["beneficiary-profile", id],
    queryFn: () => getBeneficiaryProfile(id),
  });
};

export const useGenerateBeneficiaryReportMutation = () => {
  return useMutation({
    mutationFn: generateBeneficiaryReport,
  });
};
