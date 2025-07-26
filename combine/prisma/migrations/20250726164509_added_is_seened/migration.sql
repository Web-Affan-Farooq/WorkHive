/*
  Warnings:

  - Added the required column `isSeened` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "isSeened" BOOLEAN NOT NULL;
