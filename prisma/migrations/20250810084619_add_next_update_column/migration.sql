/*
  Warnings:

  - Added the required column `nextUpdate` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."IndustryInsight" ADD COLUMN     "nextUpdate" TIMESTAMP(3) NOT NULL;
