/*
  Warnings:

  - Added the required column `category` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SALARY', 'FREELANCE', 'INVESTMENT', 'BUSINESS', 'BONUS', 'OTHER_INCOME', 'RENT', 'FOOD', 'UTILITIES', 'TRANSPORT', 'HEALTHCARE', 'EDUCATION', 'ENTERTAINMENT', 'SHOPPING', 'OTHER_EXPENSE');

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "category" "Category" NOT NULL;
