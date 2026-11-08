import { z } from "zod";

export const womenTrainingSchema = z.object({
  womanId: z.number().optional(),
  womenAssociationId: z.number().optional(),
  fullName: z.string().min(1, "Full name is required"),
  faydaId: z.string().optional(),
  trainingTopic: z.string().min(1, "Training topic is required"),
  startDate: z.string().min(1, "Start date is required"),
  completionDate: z.string().optional(),
  attended: z.boolean().default(false),
  remark: z.string().optional(),
});

export type WomenTrainingSchemaType = z.infer<typeof womenTrainingSchema>;