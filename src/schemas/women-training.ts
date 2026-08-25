import { z } from "zod";

export const womenTrainingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  trainingTopic: z.string().min(1, "Training topic is required"),
  startDate: z.string().min(1, "Start date is required"),
  completionDate: z.string().optional(),
  attended: z.boolean().default(false),
  remark: z.string().optional(),
});

export type WomenTrainingSchemaType = z.infer<typeof womenTrainingSchema>;