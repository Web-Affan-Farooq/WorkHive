/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubId]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Accounts_stripeCustomerId_key" ON "Accounts"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_stripeSubId_key" ON "Accounts"("stripeSubId");
