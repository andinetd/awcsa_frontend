import { z } from "zod";
import { EdirLevel } from "@/api/social-affairs/edir";

export const edirCouncilLevelSchema = z.enum(["WOREDA", "SUB_CITY", "CITY"]);

export const councilLeadershipMemberSchema = z.object({
  fullName: z.string().min(1, "Member full name is required"),
  role: z.string().min(1, "Role / title label is required"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export type CouncilLeadershipMember = z.infer<typeof councilLeadershipMemberSchema>;

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
    leadershipMembers: z.array(councilLeadershipMemberSchema).optional(),
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