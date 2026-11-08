import { z } from "zod";

export const womenEmploymentSchema = z.object({
  womanId: z.number().optional(),
  womenAssociationId: z.number().optional(),
  fullName: z.string().min(1, "Full name is required"),
  faydaId: z.string().optional(),
  employmentType: z.enum(["INDIVIDUAL", "GROUP"]),
  sector: z.string().min(1, "Sector is required"),
  year: z.string().min(4, "Year is required"),
  remark: z.string().optional(),
});

export type WomenEmploymentSchemaType = z.infer<typeof womenEmploymentSchema>;