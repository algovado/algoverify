/*
  Warnings:

  - You are about to alter the column `count` on the `AssetCounts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `featuredAsset` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `specialAmount` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `blacklist` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `assetId` on the `ProjectAssets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `assets` on the `UserWallet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "AssetCounts" ALTER COLUMN "count" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "featuredAsset" SET DATA TYPE INTEGER,
ALTER COLUMN "specialAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "blacklist" SET DATA TYPE INTEGER[];

-- AlterTable
ALTER TABLE "ProjectAssets" ALTER COLUMN "assetId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserWallet" ALTER COLUMN "assets" SET DATA TYPE INTEGER[];
