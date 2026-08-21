import { z } from "zod";

export const edirMemberDetailSchema = z.object({
  male: z.coerce.number().min(0),
  female: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
});

export const edirFoundingMemberSchema = z.object({
  fullName: z.string().min(2, "Founding member name is required"),
  address: z.string().optional(),
});

export const edirAssetSchema = z.object({
  type: z.enum(["CASH", "IN_KIND"], {
    message: "Asset type is required",
  }),
  description: z.string().min(1, "Asset description is required"),
  value: z.coerce.number().min(0, "Asset value must be positive"),
});

export const newEdirSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  establishmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  registerLevel: z.enum(["WOREDA", "SUB_CITY", "CITY"]).default("WOREDA"),
  subCity: z.string().min(2, "Sub-city is required"),
  woreda: z.string().min(1, "Woreda is required"),
  kebele: z.string().min(1, "Kebele is required"),
  houseNumber: z.string().min(1, "House number is required"),
  specificLocation: z.string().min(1, "Specific location is required"),
  members: z.object({
    management: edirMemberDetailSchema,
    general: edirMemberDetailSchema,
  }),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  monthlyPaymentDetails: z.string().min(1, "Payment details are required"),
  remark: z.string().optional(),
  // Directive 151/2016 registration criteria (Article 7)
  foundingMembers: z.array(edirFoundingMemberSchema).min(1).default([]),
  assets: z.array(edirAssetSchema).default([]),
  assetsAuditedByAuditCommittee: z.boolean().default(false),
  assetsApprovedByGeneralAssembly: z.boolean().default(false),
  byLawsDocId: z.coerce.number().optional().nullable(),
});

export type NewEdirSchemaType = z.infer<typeof newEdirSchema>;