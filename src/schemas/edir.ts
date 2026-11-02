import { z } from "zod";

export const edirMemberDetailSchema = z.object({
  male: z.coerce.number().min(0),
  female: z.coerce.number().min(0),
  total: z.coerce.number().min(0).optional(),
});

export const edirLeadershipMemberSchema = z.object({
  fullName: z.string().min(1, "Member full name is required"),
  position: z.string().min(1, "Position is required"),
  phoneNumber: z.string().optional().nullable(),
});

export const edirFoundingMemberSchema = z.object({
  fullName: z.string().min(1, "Founding member name is required"),
  address: z.string().optional(),
});

export const edirAssetSchema = z.object({
  type: z.enum(["CASH", "IN_KIND"], {
    message: "Asset type is required",
  }),
  category: z
    .enum(["LIQUID_CASH", "FIXED_PROPERTY", "MOVABLE_EQUIPMENT", "INVESTMENT"])
    .default("MOVABLE_EQUIPMENT"),
  description: z.string().min(1, "Asset description is required"),
  value: z.coerce.number().min(0, "Asset value must be positive"),
  documentId: z.coerce.number().optional().nullable(),
  fileName: z.string().optional().nullable(),
});

export const newEdirSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  establishmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  edirType: z
    .enum(["COMMUNITY", "WOMENS", "WORKPLACE", "SPECIALIZED"])
    .default("COMMUNITY"),
  registerLevel: z.enum(["WOREDA", "SUB_CITY", "CITY"]).default("WOREDA"),
  subCity: z.string().min(1, "Sub-city is required"),
  woreda: z.string().min(1, "Woreda is required"),
  kebele: z.string().optional(),
  houseNumber: z.string().optional().nullable(),
  specificLocation: z.string().optional().nullable(),
  members: edirMemberDetailSchema,
  totalAssetValue: z.coerce.number().min(0).optional().nullable(),
  bankAccountNumber: z.string().optional().default(""),
  monthlyPaymentDetails: z.string().optional().default(""),
  additionalIncome: z.string().optional().nullable(),
  remark: z.string().optional(),
  // Leadership & Directive 151/2016 registration criteria
  leadershipMembers: z.array(edirLeadershipMemberSchema).default([]),
  foundingMembers: z.array(edirFoundingMemberSchema).optional().default([]),
  assets: z.array(edirAssetSchema).default([]),
  assetsAuditedByAuditCommittee: z.boolean().default(false),
  assetsApprovedByGeneralAssembly: z.boolean().default(false),
  byLawsDocId: z.coerce.number().optional().nullable(),
  documentIds: z.array(z.coerce.number()).optional().default([]),
  councilId: z.coerce.number().optional().nullable(),
});

export type NewEdirSchemaType = z.infer<typeof newEdirSchema>;