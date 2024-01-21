/*
  Warnings:

  - You are about to drop the column `blacklist` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `creatorWallets` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "blacklist",
DROP COLUMN "creatorWallets";

-- CreateTable
CREATE TABLE "CreatorWallet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,

    CONSTRAINT "CreatorWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistedAsset" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "assetId" INTEGER NOT NULL,

    CONSTRAINT "BlacklistedAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreatorWallet" ADD CONSTRAINT "CreatorWallet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlacklistedAsset" ADD CONSTRAINT "BlacklistedAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
