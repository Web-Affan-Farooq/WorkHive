/*
  Warnings:

  - You are about to drop the column `plan` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "plan";
