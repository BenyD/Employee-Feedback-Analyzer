import { z } from "zod";

export const feedbackFormSchema = z
  .object({
    isAnonymous: z.boolean(),
    name: z.string().optional(),
    departmentId: z.string().uuid("Please select a department"),
    overallRating: z
      .number()
      .min(1, "Overall rating is required")
      .max(5, "Rating must be between 1-5"),
    workEnvironmentRating: z
      .number()
      .min(1, "Work environment rating is required")
      .max(5, "Rating must be between 1-5"),
    managementRating: z
      .number()
      .min(1, "Management rating is required")
      .max(5, "Rating must be between 1-5"),
    compensationRating: z
      .number()
      .min(1, "Compensation rating is required")
      .max(5, "Rating must be between 1-5"),
    growthOpportunitiesRating: z
      .number()
      .min(1, "Growth opportunities rating is required")
      .max(5, "Rating must be between 1-5"),
    comments: z
      .string()
      .min(10, "Comments must be at least 10 characters")
      .max(2000, "Comments must be less than 2000 characters"),
    suggestions: z
      .string()
      .min(10, "Suggestions must be at least 10 characters")
      .max(2000, "Suggestions must be less than 2000 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.isAnonymous && (!data.name || data.name.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Name is required when not submitting anonymously",
      path: ["name"],
    }
  );

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
});

export type Department = z.infer<typeof departmentSchema>;
