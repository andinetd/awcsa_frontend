import { useMutation } from "@tanstack/react-query";
import {
  generateWomenReport,
  GenerateWomenReportPayload,
} from "@/api/womens/generateWomenReport";
import {
  generateAssociationReport,
  AssociationReportFormat,
} from "@/api/womens/associationReport";

export const useGenerateWomenReportMutation = () => {
  return useMutation({
    mutationFn: (payload: GenerateWomenReportPayload) => generateWomenReport(payload),
  });
};

export const useGenerateAssociationReportMutation = () => {
  return useMutation({
    mutationFn: (payload: {
      associationId: number;
      format: AssociationReportFormat;
      language?: "en" | "am";
    }) => generateAssociationReport(payload),
  });
};
