import { Request, Response, NextFunction } from "express";
import { ZodAny } from "zod";

export const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: result.error.errors.map((err: any) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }

            req.body = result.data;
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Validation error",
            });
        }
    };
};
