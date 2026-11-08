import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTechnologySupport,
  getTechnologySupportById,
  registerTechnologySupport,
  updateTechnologySupport,
  deleteTechnologySupport,
  addTechnologySupportMonitoring,
  getTechnologySupportMonitoring,
  MonitoringPayload,
} from "@/api/womens/technologySupport";
import {
  getWomenTrainings,
  getTrainingCandidates,
  getTrainingById,
  registerWomenTraining,
  updateTraining,
  deleteTraining,
  addTrainingMonitoring,
  getTrainingMonitoring,
  TrainingPayload,
  UpdateTrainingPayload,
} from "@/api/womens/training";
import {
  getWomenEmployments,
  getEmploymentById,
  registerWomenEmployment,
  updateEmployment,
  deleteEmployment,
  addEmploymentMonitoring,
  getEmploymentMonitoring,
  EmploymentPayload,
  UpdateEmploymentPayload,
} from "@/api/womens/employment";

// ─── Technology Support ─────────────────────────────────────────

export const useGetTechnologySupportQuery = () => {
  return useQuery({
    queryKey: ["women-technology-support"],
    queryFn: getTechnologySupport,
  });
};

export const useGetTechnologySupportByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-technology-support", id],
    queryFn: () => getTechnologySupportById(id),
    enabled: !!id,
  });
};

export const useRegisterTechnologySupportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerTechnologySupport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-technology-support"] });
    },
  });
};

export const useUpdateTechnologySupportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: any }) => updateTechnologySupport(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-technology-support"] });
      queryClient.invalidateQueries({ queryKey: ["women-technology-support", variables.id] });
    },
  });
};

export const useDeleteTechnologySupportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTechnologySupport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-technology-support"] });
    },
  });
};

export const useAddTechnologySupportMonitoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: MonitoringPayload }) =>
      addTechnologySupportMonitoring(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-technology-support", variables.id] });
    },
  });
};

export const useGetTechnologySupportMonitoringQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-technology-support-monitoring", id],
    queryFn: () => getTechnologySupportMonitoring(id),
    enabled: !!id,
  });
};

// ─── Training ───────────────────────────────────────────────────

export const useGetWomenTrainingsQuery = () => {
  return useQuery({
    queryKey: ["women-trainings"],
    queryFn: getWomenTrainings,
  });
};

export const useGetTrainingCandidatesQuery = () => {
  return useQuery({
    queryKey: ["women-training-candidates"],
    queryFn: getTrainingCandidates,
  });
};

export const useGetTrainingByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-training", id],
    queryFn: () => getTrainingById(id),
    enabled: !!id,
  });
};

export const useRegisterWomenTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TrainingPayload) => registerWomenTraining(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-trainings"] });
    },
  });
};

export const useUpdateTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateTrainingPayload }) => updateTraining(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-trainings"] });
      queryClient.invalidateQueries({ queryKey: ["women-training", variables.id] });
    },
  });
};

export const useDeleteTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTraining(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-trainings"] });
    },
  });
};

export const useAddTrainingMonitoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: MonitoringPayload }) =>
      addTrainingMonitoring(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-training", variables.id] });
    },
  });
};

export const useGetTrainingMonitoringQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-training-monitoring", id],
    queryFn: () => getTrainingMonitoring(id),
    enabled: !!id,
  });
};

// ─── Employment ─────────────────────────────────────────────────

export const useGetWomenEmploymentsQuery = () => {
  return useQuery({
    queryKey: ["women-employments"],
    queryFn: getWomenEmployments,
  });
};

export const useGetEmploymentByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-employment", id],
    queryFn: () => getEmploymentById(id),
    enabled: !!id,
  });
};

export const useRegisterWomenEmploymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmploymentPayload) => registerWomenEmployment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-employments"] });
    },
  });
};

export const useUpdateEmploymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateEmploymentPayload }) =>
      updateEmployment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-employments"] });
      queryClient.invalidateQueries({ queryKey: ["women-employment", variables.id] });
    },
  });
};

export const useDeleteEmploymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEmployment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["women-employments"] });
    },
  });
};

export const useAddEmploymentMonitoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: MonitoringPayload }) =>
      addEmploymentMonitoring(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["women-employment", variables.id] });
    },
  });
};

export const useGetEmploymentMonitoringQuery = (id: number) => {
  return useQuery({
    queryKey: ["women-employment-monitoring", id],
    queryFn: () => getEmploymentMonitoring(id),
    enabled: !!id,
  });
};
