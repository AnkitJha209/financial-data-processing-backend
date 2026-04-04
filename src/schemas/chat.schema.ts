import * as z from "zod";

export const chatQuestionSchema = z.object({
    question: z
        .string()
        .trim()
        .min(3, "Question must be at least 3 characters")
        .max(1000, "Question must be at most 1000 characters"),
});

export type ChatQuestionInput = z.infer<typeof chatQuestionSchema>;
