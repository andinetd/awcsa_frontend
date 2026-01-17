import { z } from "zod";

export const memberSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  edirIdNumber: z.string().min(1, "Edir ID is required"),
  cityIdNumber: z.string().min(1, "City ID is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  job: z.string().optional().default(""),
  position: z.string().min(1, "Position is required"),
  familyMembersCount: z.coerce.number().min(0),
  joinedAt: z.string().min(1, "Join date is required"),
  leftAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type MemberSchemaType = z.infer<typeof memberSchema>;
