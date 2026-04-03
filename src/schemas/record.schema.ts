import * as z from "zod";

export const createRecordSchema = z.object({
    amount: z.number().positive("Amount must be a positive number"),
    type: z.enum(
        ["INCOME", "EXPENSE"],
        "Type must be either INCOME or EXPENSE",
    ),
    description: z
        .string()
        .max(200, "Description must be at most 200 characters")
        .optional(),
    date: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
    category: z.enum(
        ['SALARY', 'FREELANCE', 'INVESTMENT', 'BUSINESS', 'BONUS', 'OTHER_INCOME',
        'RENT', 'FOOD', 'UTILITIES', 'TRANSPORT', 'HEALTHCARE',
        'EDUCATION', 'ENTERTAINMENT', 'SHOPPING', 'OTHER_EXPENSE'],
        "Category must be a valid option",
    ),
});

export const updateRecordSchema = createRecordSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
