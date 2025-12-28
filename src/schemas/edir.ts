import { z } from "zod";

export const edirMemberDetailSchema = z.object({
  male: z.coerce.number().min(0),
  female: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
});

export const newEdirSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  establishmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  formationMethod: z.enum([
    "WILL_OF_PEOPLE",
    "GOVERNMENT_ISSUED",
  ]),
  subCity: z.string().min(2, "Sub-city is required"),
  woreda: z.string().min(1, "Woreda is required"),
  kebele: z.string().min(1, "Kebele is required"),
  houseNumber: z.string().min(1, "House number is required"),
  specificLocation: z.string().min(1, "Specific location is required"),
  members: z.object({
    management: edirMemberDetailSchema,
    general: edirMemberDetailSchema,
  }),
  establishmentReasons: z.object({
    religionBased: z.boolean().default(false),
    workplaceBased: z.boolean().default(false),
    birthplaceBased: z.boolean().default(false),
    professionBased: z.boolean().default(false),
    residenceBased: z.boolean().default(false),
    genderBased: z.boolean().default(false),
    ethnicityBased: z.boolean().default(false),
    other: z.string().optional(),
  }),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  monthlyPaymentDetails: z.string().min(1, "Payment details are required"),
  remark: z.string().optional(),
  regulationsDocId: z.coerce.number().optional(),
});

export type NewEdirSchemaType = z.infer<typeof newEdirSchema>;
