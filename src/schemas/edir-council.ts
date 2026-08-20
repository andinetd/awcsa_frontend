import { z } from "zod";
import { EdirLevel } from "@/api/social-affairs/edir";

export const edirCouncilLevelSchema = z.enum(["WOREDA", "SUB_CITY", "CITY"]);

export const newEdirCouncilSchema = z
  .object({
    name: z.string().min(2, "Council name is required"),
    level: edirCouncilLevelSchema,
    subCity: z.string().min(2, "Sub city is required"),
    woreda: z.string().optional(),
    kebele: z.string().optional(),
    establishmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
    chairpersonName: z.string().optional(),
    chairpersonPhone: z.string().optional(),
    contactPhone: z.string().optional(),
    address: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.level === "WOREDA" && !val.woreda) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["woreda"],
        message: "Woreda is required for a Woreda level council",
      });
    }
  });

export type NewEdirCouncilSchemaType = z.infer<
  typeof newEdirCouncilSchema
>;

export const LEVEL_LABEL_MAP: Record<EdirLevel, string> = {
  WOREDA: "Woreda",
  SUB_CITY: "Sub City",
  CITY: "City",
};