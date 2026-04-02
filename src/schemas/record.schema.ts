import * as z from "zod";

export const recordSchema = z.object({
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
});

export const updateRecordSchema = recordSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });

export type RecordInput = z.infer<typeof recordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
