import { z } from "zod";

export function parseFullName(fullName?: string | null) {
  if (!fullName) return { firstName: "", lastName: "", grandfatherName: "" };
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts[1] || "";
  const grandfatherName = parts.slice(2).join(" ");
  return { firstName, lastName, grandfatherName };
}

export const womenProfileSchema = z.object({
  faydaId: z
    .string()
    .trim()
    .min(1, "Fayda ID is required")
    .refine(
      (val) => /^[0-9]{4,32}$/.test(val.replace(/[\s-]/g, "")),
      "Fayda ID must be 4 to 32 digits (e.g. 123456789012)",
    ),
  cityIdNumber: z.string().optional(),
  confirmLink: z.boolean().optional(),

  // Participant
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .refine(
      (val) => val.trim().split(/\s+/).filter(Boolean).length >= 2,
      "Please enter both First Name and Father's Name (e.g. Almaz Tesfaye)",
    ),
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  grandfatherName: z.string().optional().default(""),
  phoneNumber: z.string().optional(),
  age: z.coerce.number().int().min(10, "Age must be at least 10").max(120, "Age must be at most 120"),
  dateOfBirth: z.string().optional(),
  educationLevel: z.string().min(1, "Education level is required"),

  // Address
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  zone: z.string().optional(),
  block: z.string().optional(),
  address: z.string().optional(),

  // ── Training Intake Needs ────────────────────────────────────────────────
  wantsTraining: z.boolean().default(false),
  requestedTrainingTopic: z.string().optional(),
  postTrainingParticipation: z.string().optional(),
  desiredSector: z.string().optional(),
  traineeCategory: z.string().optional().default("NONE"),
  traineeStatus: z.array(z.string()).default([]),

  // ── Referral for Support Intake Needs ────────────────────────────────────
  wantsSupport: z.boolean().default(false),
  associationId: z.coerce.number().optional().nullable(),
  cooperativeName: z.string().optional(),
  requestedTechnologyType: z.string().optional(),
  supportStatus: z.string().optional(),
  supportMode: z.string().optional(),
  disabilityType: z.string().optional().default("NONE"),
  disabilities: z.array(z.string()).default([]),

  // ── Sensitive Health Assessment (strictly guarded by consent) ─────────────
  healthStatus: z.string().optional().default("NONE"),
  healthConsent: z.boolean().default(false),
  healthConditions: z.array(z.string()).default([]),

  // ── Family and Income Status ─────────────────────────────────────────────
  familyStatus: z.string().optional(),
  incomeStatus: z.string().optional(),

  careerStatus: z.string().optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.coerce.number().optional(),
  photoUrl: z.string().optional(),
});

export type WomenProfileSchemaType = z.infer<typeof womenProfileSchema>;

