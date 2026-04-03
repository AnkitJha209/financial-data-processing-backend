import { prisma } from "../prismaClient/client";
import { hashPass } from "../utils/passwordEncryption";
import { Category, Role, Type } from "../../generated/prisma/enums";

const createSampleRecords = async (userId: string) => {
    const today = new Date();

    const sampleRecords = [
        {
            amount: 5000,
            type: Type.INCOME,
            category: Category.SALARY,
            description: "Monthly salary",
            date: new Date(today.getFullYear(), today.getMonth(), 1),
        },
        {
            amount: 1200,
            type: Type.INCOME,
            category: Category.FREELANCE,
            description: "Freelance project",
            date: new Date(today.getFullYear(), today.getMonth(), 8),
        },
        {
            amount: 1800,
            type: Type.EXPENSE,
            category: Category.RENT,
            description: "House rent",
            date: new Date(today.getFullYear(), today.getMonth(), 3),
        },
        {
            amount: 450,
            type: Type.EXPENSE,
            category: Category.FOOD,
            description: "Groceries and dining",
            date: new Date(today.getFullYear(), today.getMonth(), 10),
        },
        {
            amount: 220,
            type: Type.EXPENSE,
            category: Category.TRANSPORT,
            description: "Fuel and commute",
            date: new Date(today.getFullYear(), today.getMonth(), 12),
        },
        {
            amount: 180,
            type: Type.EXPENSE,
            category: Category.ENTERTAINMENT,
            description: "Movies and subscriptions",
            date: new Date(today.getFullYear(), today.getMonth(), 15),
        },
    ];

    await prisma.record.createMany({
        data: sampleRecords.map((record) => ({
            ...record,
            userId,
        })),
    });
};

const run = async () => {
    try {
        const adminPassword = await hashPass("Admin@123");
        const analystPassword = await hashPass("Analyst@123");

        const adminUser = await prisma.user.upsert({
            where: { email: "admin@zorvyn.com" },
            update: {
                name: "System Admin",
                role: Role.ADMIN,
                hashPassword: adminPassword,
                status: true,
                isDeleted: false,
            },
            create: {
                name: "System Admin",
                email: "admin@zorvyn.com",
                hashPassword: adminPassword,
                role: Role.ADMIN,
            },
        });

        const analystUser = await prisma.user.upsert({
            where: { email: "analyst@zorvyn.com" },
            update: {
                name: "Finance Analyst",
                role: Role.ANALYST,
                hashPassword: analystPassword,
                status: true,
                isDeleted: false,
            },
            create: {
                name: "Finance Analyst",
                email: "analyst@zorvyn.com",
                hashPassword: analystPassword,
                role: Role.ANALYST,
            },
        });

        // Re-seed records for deterministic demo data.
        await prisma.record.deleteMany({
            where: {
                userId: analystUser.id,
            },
        });

        await createSampleRecords(analystUser.id);

        console.log("Seed completed successfully.");
        console.log("Users created/updated:");
        console.log(`- ${adminUser.email} (ADMIN)`);
        console.log(`- ${analystUser.email} (ANALYST)`);
        console.log("Sample records created for analyst user.");
        console.log("Login passwords:");
        console.log("- Admin: Admin@123");
        console.log("- Analyst: Analyst@123");
    } catch (error) {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
};

run();
