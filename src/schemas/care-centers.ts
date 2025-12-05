import z from "zod";

export const NewCareCenterSchema = z.object({
  name: z.string(),
  type: z.string(),
  phone: z.string(),
  email: z.string(),
  region: z.string(),
  subCity: z.string(),
  woreda: z.string(),
  kebele: z.string(),
  houseNumber: z.string(),
  place: z.string(),
  description: z.string(),
  childrenAgeRange: z.object({
    min: z.number().int(),
    max: z.number().int(),
  }),
  orgUnitId: z.string().optional(),
  contactPerson: z.string(),
  loginUsername: z.string(),
});

export type NewCareCenterSchemaType = z.infer<typeof NewCareCenterSchema>;
