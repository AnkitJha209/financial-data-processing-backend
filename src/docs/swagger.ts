import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Zorvyn Assignment API",
            version: "1.0.0",
            description:
                "Backend APIs for financial records, auth, dashboard analytics, and exports.",
        },
        servers: [
            {
                url: "https://financial-data-processing-backend-2.onrender.com/",
                description: "Production server hosted on Render",
            },
            {
                url: "http://localhost:8080",
                description: "Local development server",
            }

        ],
        tags: [
            { name: "Auth", description: "Authentication and profile APIs" },
            { name: "Records", description: "CRUD for financial records" },
            {
                name: "Dashboard",
                description: "Aggregated analytics endpoints",
            },
            { name: "Export", description: "CSV export endpoints" },
            { name: "Chat", description: "AI-assisted analytics endpoint" },
            { name: "Admin", description: "Admin user management endpoints" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                RegisterRequest: {
                    type: "object",
                    required: ["email", "name", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "user@example.com",
                        },
                        name: {
                            type: "string",
                            minLength: 2,
                            example: "Ankit Jha",
                        },
                        password: {
                            type: "string",
                            minLength: 6,
                            example: "Admin@123",
                        },
                        role: {
                            type: "string",
                            enum: ["ADMIN", "VIEWER", "ANALYST"],
                            default: "VIEWER",
                            example: "VIEWER",
                        },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "admin@zorvyn.com",
                        },
                        password: { type: "string", example: "Admin@123" },
                    },
                },
                RecordRequest: {
                    type: "object",
                    required: ["amount", "type", "date", "category"],
                    properties: {
                        amount: {
                            type: "number",
                            minimum: 0.01,
                            example: 1500.5,
                        },
                        type: {
                            type: "string",
                            enum: ["INCOME", "EXPENSE"],
                            example: "EXPENSE",
                        },
                        description: {
                            type: "string",
                            maxLength: 200,
                            example: "Electricity bill",
                        },
                        date: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-01T10:00:00.000Z",
                        },
                        category: {
                            type: "string",
                            enum: [
                                "SALARY",
                                "FREELANCE",
                                "INVESTMENT",
                                "BUSINESS",
                                "BONUS",
                                "OTHER_INCOME",
                                "RENT",
                                "FOOD",
                                "UTILITIES",
                                "TRANSPORT",
                                "HEALTHCARE",
                                "EDUCATION",
                                "ENTERTAINMENT",
                                "SHOPPING",
                                "OTHER_EXPENSE",
                            ],
                            example: "UTILITIES",
                        },
                    },
                },
                UpdateUserRoleRequest: {
                    type: "object",
                    required: ["role"],
                    properties: {
                        role: {
                            type: "string",
                            enum: ["ADMIN", "VIEWER", "ANALYST"],
                            example: "ANALYST",
                        },
                    },
                },
                ChatQuestionRequest: {
                    type: "object",
                    required: ["question"],
                    properties: {
                        question: {
                            type: "string",
                            minLength: 3,
                            maxLength: 1000,
                            example: "What was my highest expense this month?",
                        },
                    },
                },
            },
        },
    },
    apis: [path.join(process.cwd(), "src/routes/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express) => {
    app.use(
        "/api/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, { explorer: true }),
    );

    app.get("/api/docs.json", (_req, res) => {
        res.json(swaggerSpec);
    });
};
