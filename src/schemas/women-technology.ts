import { z } from "zod";

export const technologySupportSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  technologyType: z.string().min(1, "Technology type is required"),
  associationName: z.string().optional(),
  isPoor: z.boolean().default(false),
  isSexWorker: z.boolean().default(false),
  disabilities: z.array(z.string()).default([]),
  healthConditions: z.array(z.string()).default([]),
});

export type TechnologySupportSchemaType = z.infer<typeof technologySupportSchema>;