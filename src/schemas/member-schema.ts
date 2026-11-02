import { z } from "zod";

export const memberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  position: z.string().min(1, "Position is required"),
  phoneNumber: z.string().optional().default(""),
  edirIdNumber: z.string().optional().default("N/A"),
  cityIdNumber: z.string().optional().default("N/A"),
  job: z.string().optional().default(""),
  familyMembersCount: z.coerce.number().optional().default(0),
  joinedAt: z.string().optional().default(""),
  leftAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type MemberSchemaType = z.infer<typeof memberSchema>;
