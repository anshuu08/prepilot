import z from "zod";

export const onboardingSchema = z.object({
  bio: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  bio: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "User should have at least 0 years of experience")
        .max(50, "Experience cannot exceed 50 years")
    ),
  bio: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : []
    ),
});
