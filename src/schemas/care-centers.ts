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
    min: z.number(),
    max: z.number(),
  }),
  orgUnitId: z.coerce.number().optional(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type NewCareCenterSchemaType = z.infer<typeof NewCareCenterSchema>;
