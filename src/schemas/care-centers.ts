import z from "zod";

export const NewCareCenterSchema = z.object({
  name: z.string(),
  location: z.string(),
  minAge: z.number().int(),
  maxAge: z.number().int(),
});

export type NewCareCenterSchemaType = z.infer<typeof NewCareCenterSchema>;
