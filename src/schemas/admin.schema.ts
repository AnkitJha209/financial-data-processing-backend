import * as z from "zod";

export const updateUserRoleSchema = z.object({
    role: z.enum(["ADMIN", "VIEWER", "ANALYST"], "Invalid role"),
});


export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;