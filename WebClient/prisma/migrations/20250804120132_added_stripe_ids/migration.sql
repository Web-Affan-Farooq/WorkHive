/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubId` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubId" TEXT;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubId";
