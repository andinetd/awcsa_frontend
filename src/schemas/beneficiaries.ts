import { z } from "zod";

export const beneficiaryRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  cityIdNumber: z.string().min(1, "City ID number is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
  address: z.string().optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional(),
  familyMembersCount: z.coerce.number().optional(),
  // Specific fields
  disabilityType: z.string().optional(),
  disabilityLevel: z.string().optional(),
  cause: z.string().optional(),
  type: z.enum(["DISABLED", "ELDERLY"]),
});

export const trainingSchema = z.object({
  cityIdNumber: z.string().min(1, "City ID number is required"),
  trainingType: z.string().min(1, "Training type is required"),
  provider: z.string().min(1, "Provider is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  completionDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid completion date",
    }),
  dropoutDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid dropout date",
    }),
  dropoutReason: z.string().optional(),
  hasCOC: z.boolean().default(false),
  remark: z.string().optional(),
});

export const jobPlacementSchema = z.object({
  cityIdNumber: z.string().min(1, "City ID number is required"),
  companyIdNumber: z.string().min(1, "Company ID number is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  remark: z.string().optional(),
});

export type BeneficiaryRegistrationSchemaType = z.infer<
  typeof beneficiaryRegistrationSchema
>;
export type TrainingSchemaType = z.infer<typeof trainingSchema>;
export type JobPlacementSchemaType = z.infer<typeof jobPlacementSchema>;
