import { z } from "zod";

export const WOMEN_LEADER_POSITIONS = [
  "CHAIRPERSON",
  "VICE_CHAIRPERSON",
  "SECRETARY",
  "WORK_SKILLS_RESPONSIBLE",
  "EDUCATION_RESPONSIBLE",
] as const;

export type WomenLeaderPosition =
  (typeof WOMEN_LEADER_POSITIONS)[number];

const REQUIRED_SLOTS = 3;

export const womenAssociationLeaderSchema = z.object({
  position: z.enum(WOMEN_LEADER_POSITIONS),
  fullName: z.string(),
  phoneNumber: z.string(),
});

export const womenAssociationSchema = z
  .object({
    name: z.string().min(1, "Association name is required"),
    type: z.enum(["ASSOCIATION", "DEVELOPMENT_ASSOCIATION", "FEDERATION"], {
      message: "Association type is required",
    }),
    establishmentDate: z.string().min(1, "Establishment date is required"),
    objective: z.string().optional(),
    subCity: z.string().min(1, "Sub city is required"),
    woreda: z.string().min(1, "Woreda is required"),
    houseNumber: z.string().optional(),
    block: z.string().optional(),
    totalMembers: z.coerce.number().int().min(0).optional(),
    leaders: z.array(womenAssociationLeaderSchema).length(
      WOMEN_LEADER_POSITIONS.length,
    ),
  })
  .superRefine((data, ctx) => {
    data.leaders.forEach((leader, index) => {
      const slotRequired = index < REQUIRED_SLOTS;
      const hasName = leader.fullName.trim().length > 0;
      const hasPhone = leader.phoneNumber.trim().length > 0;

      if (slotRequired || hasName || hasPhone) {
        if (!hasName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["leaders", index, "fullName"],
            message: "Full name is required",
          });
        }
        if (!hasPhone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["leaders", index, "phoneNumber"],
            message: "Phone number is required",
          });
        } else if (!/^[0-9+\-\s]+$/.test(leader.phoneNumber.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["leaders", index, "phoneNumber"],
            message: "Invalid phone number format",
          });
        } else if (leader.phoneNumber.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["leaders", index, "phoneNumber"],
            message: "Valid phone number is required",
          });
        }
      }
    });

    const positions = data.leaders
      .filter((l) => l.fullName.trim())
      .map((l) => l.position);
    if (new Set(positions).size !== positions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leaders"],
        message: "Duplicate committee positions are not allowed",
      });
    }
  });

export type WomenAssociationLeaderFormValue = z.infer<
  typeof womenAssociationLeaderSchema
>;

export type WomenAssociationSchemaType = z.infer<typeof womenAssociationSchema>;
