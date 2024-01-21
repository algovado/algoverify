/*
  Warnings:

  - A unique constraint covering the columns `[projectId,wallet]` on the table `CreatorWallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreatorWallet_projectId_wallet_key" ON "CreatorWallet"("projectId", "wallet");
