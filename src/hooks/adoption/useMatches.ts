import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import {
  getMatchNotes,
  getMatchDetails,
  addPostMatchNote,
  updatePostMatchNote,
  updateMatch,
  listFollowUpReports,
  getFollowUpReport,
  submitFollowUpReport,
  reviewFollowUpReport,
  CreatePostMatchNotePayload,
  UpdatePostMatchNotePayload,
  UpdateMatchPayload,
  CreateFollowUpReportPayload,
  ReviewFollowUpReportPayload,
  FollowUpReportStatus,
  listPostPlacementVisits,
  getPostPlacementVisit,
  recordPostPlacementVisit,
  updatePostPlacementVisit,
  CreatePostPlacementVisitPayload,
  UpdatePostPlacementVisitPayload,
  processReunification,
  getReunificationDetails,
  ProcessReunificationPayload,
  BiologicalParentReunification,
} from "@/api/adoption/matches";
import { toast } from "sonner";

export const useGetMatchNotes = (
  matchId: number | null | undefined,
  category?: string,
) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "notes", category],
    queryFn: () => getMatchNotes(matchId!, category),
    enabled: !!token && !!matchId,
    staleTime: 60 * 1000,
  });
};

export const useGetMatchDetails = (matchId: number | null | undefined) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "details"],
    queryFn: () => getMatchDetails(matchId!),
    enabled: !!token && !!matchId,
    staleTime: 60 * 1000,
  });
};

export const useAddPostMatchNote = (matchId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostMatchNotePayload) => {
      if (!matchId) throw new Error("Match ID is required");
      return addPostMatchNote(matchId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "notes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "details"],
      });
      toast.success("Post-match note added successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add note";
      toast.error(message);
    },
  });
};

export const useUpdatePostMatchNote = (matchId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: number;
      payload: UpdatePostMatchNotePayload;
    }) => {
      if (!matchId) throw new Error("Match ID is required");
      return updatePostMatchNote(matchId, noteId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "notes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "details"],
      });
      toast.success("Post-match note updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update note";
      toast.error(message);
    },
  });
};

export const useUpdateMatch = (matchId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMatchPayload) => {
      if (!matchId) throw new Error("Match ID is required");
      return updateMatch(matchId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["application", "child-details"],
      });
      toast.success("Match updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update match";
      toast.error(message);
    },
  });
};

// ─── Follow-Up Report Hooks ───────────────────────────────────────────────────

export const useListFollowUpReports = (
  matchId: number | null | undefined,
  status?: FollowUpReportStatus,
) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "followup-reports", status],
    queryFn: () => listFollowUpReports(matchId!, status),
    enabled: !!token && !!matchId,
    staleTime: 60 * 1000,
  });
};

export const useGetFollowUpReport = (
  matchId: number | null | undefined,
  reportId: number | null | undefined,
) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "followup-reports", reportId],
    queryFn: () => getFollowUpReport(matchId!, reportId!),
    enabled: !!token && !!matchId && !!reportId,
    staleTime: 60 * 1000,
  });
};

export const useSubmitFollowUpReport = (matchId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFollowUpReportPayload) => {
      if (!matchId) throw new Error("Match ID is required");
      return submitFollowUpReport(matchId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "followup-reports"],
      });
      toast.success("Follow-up report submitted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit report";
      toast.error(message);
    },
  });
};

export const useReviewFollowUpReport = (matchId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: number;
      payload: ReviewFollowUpReportPayload;
    }) => {
      if (!matchId) throw new Error("Match ID is required");
      return reviewFollowUpReport(matchId, reportId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "followup-reports"],
      });
      toast.success("Review submitted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit review";
      toast.error(message);
    },
  });
};

// ─── Post-Placement Home Visit Evaluation Hooks ───────────────────────────────

export const useListPostPlacementVisits = (
  matchId: number | null | undefined,
) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "visits"],
    queryFn: () => listPostPlacementVisits(matchId!),
    enabled: !!token && !!matchId,
    staleTime: 60 * 1000,
  });
};

export const useGetPostPlacementVisit = (
  matchId: number | null | undefined,
  visitId: number | null | undefined,
) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "visits", visitId],
    queryFn: () => getPostPlacementVisit(matchId!, visitId!),
    enabled: !!token && !!matchId && !!visitId,
    staleTime: 60 * 1000,
  });
};

export const useRecordPostPlacementVisit = (
  matchId: number | null | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPlacementVisitPayload) => {
      if (!matchId) throw new Error("Match ID is required");
      return recordPostPlacementVisit(matchId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "visits"],
      });
      toast.success("Home visit evaluation recorded successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to record home visit";
      toast.error(message);
    },
  });
};

export const useUpdatePostPlacementVisit = (
  matchId: number | null | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      visitId,
      payload,
    }: {
      visitId: number;
      payload: UpdatePostPlacementVisitPayload;
    }) => {
      if (!matchId) throw new Error("Match ID is required");
      return updatePostPlacementVisit(matchId, visitId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId, "visits"],
      });
      toast.success("Home visit evaluation updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update home visit";
      toast.error(message);
    },
  });
};

// ─── Biological Parents Reunification & Rematch Hooks ─────────────────────────

export const useGetReunificationDetails = (
  matchId: number | null | undefined,
) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["adoption", "matches", matchId, "reunification"],
    queryFn: () => getReunificationDetails(matchId!),
    enabled: !!token && !!matchId,
    staleTime: 60 * 1000,
  });
};

export const useProcessReunification = (matchId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProcessReunificationPayload) => {
      if (!matchId) throw new Error("Match ID is required");
      return processReunification(matchId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches", matchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["adoption", "matches"],
      });
      queryClient.invalidateQueries({
        queryKey: ["application"],
      });
      toast.success(
        "Biological parent reunification processed. Match terminated and application updated.",
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to process biological parent reunification";
      toast.error(message);
    },
  });
};
