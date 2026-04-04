import OpenAI from "openai";
import { prisma } from "../prismaClient/client";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const chatWithRecords = async (req: Request, res: Response) => {
    try {
        const { question } = req.body;
        
        const sql_query = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {   role: "system",
                    content: `
                    You are a read-only SQL query generator for a PostgreSQL finance database.

                    Your ONLY job is to generate a single SELECT SQL query based on the user's question.

                    DATABASE SCHEMA:
                    Table name: "Record"
                    Columns:
                    - id          TEXT (primary key)
                    - userId      TEXT (foreign key to User table)
                    - amount      FLOAT
                    - type        TEXT → only possible values: 'INCOME', 'EXPENSE'
                    - category    TEXT → only possible values:
                                    Income:  'SALARY', 'FREELANCE', 'INVESTMENT', 'BUSINESS', 'BONUS', 'OTHER_INCOME'
                                    Expense: 'RENT', 'FOOD', 'UTILITIES', 'TRANSPORT', 'HEALTHCARE', 
                                            'EDUCATION', 'ENTERTAINMENT', 'SHOPPING', 'OTHER_EXPENSE'
                    - description TEXT (nullable)
                    - isDeleted   BOOLEAN (default false)
                    - date        TIMESTAMP
                    - createdAt   TIMESTAMP
                    - updatedAt   TIMESTAMP

                    STRICT RULES:
                    1. ALWAYS include WHERE "isDeleted" = false in every query
                    2. ALWAYS filter by WHERE "userId" = '{{USER_ID}}' in every query
                    3. Only generate SELECT statements — never UPDATE, INSERT, DELETE, DROP, ALTER, TRUNCATE or any other write operation
                    4. Always use double quotes around column names and table name e.g. "Record"."amount"
                    5. Never use * in SELECT — always name the columns explicitly
                    6. Keep queries simple and readable
                    7. For date filtering use DATE() function e.g. DATE("Record"."date")
                    8. For monthly trends use DATE_TRUNC('month', "Record"."date")

                    RESPONSE FORMAT — you must respond in one of two ways only:

                    If the question is a valid read/analytics question:
                    QUERY: <your SQL query here>

                    If the question asks for any insert, update, delete, or anything unrelated to finance data:
                    BLOCKED: <short reason why>

                    No explanations. No markdown. No extra text. Just QUERY: or BLOCKED: followed by the content.
                    `
                },
                {
                    role: "user",
                    content: "Explain to me how AI works",
                },
            ],
        });

        if(sql_query?.choices[0]?.message?.content?.startsWith("BLOCKED:")) {
            res.status(400).json({ 
                error: sql_query.choices[0].message.content 
            });
            return
        }

        const query = sql_query?.choices[0]?.message?.content?.split(":")[1]?.trim();

        if(!query) {
            res.status(500).json({
                error: "Failed to generate SQL query"
            });
            return
        }

        const data = await prisma.$queryRawUnsafe(query)

        const answerGeneration = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "system",
                    content: `
                    You are a helpful financial assistant. 
                    A user asked a question about their finances and the data has been fetched from the database.
                    Your job is to answer the user's question in a clear, friendly, and concise way based on the query results.

                    Rules:
                    1. Only use the data provided — do not make up or assume any numbers
                    2. Format currency amounts in Indian Rupees (₹) with commas e.g. ₹1,50,000
                    3. If the query result is empty, say "No records found for your query"
                    4. Keep the answer short and to the point — 1 to 3 sentences max
                    5. Do not mention SQL, databases, or technical terms in your answer
                    6. If results have multiple rows, summarize them cleanly
                    `
                },
                {   
                    role: "user",
                    content: `
                    Question: ${question}
                    SQL Query Result: ${JSON.stringify(data)}
                    `
                },
            ],
        });

        const answer = answerGeneration?.choices[0]?.message?.content?.trim();

        res.json({ answer });
    } catch (error) {
        console.error("Error in chatWithRecords:", error);
        res.status(500).json({ 
            success: false,
            error: "An error occurred while processing your request." 
        });
    }
}

