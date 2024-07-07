-- AlterTable
ALTER TABLE "BlacklistedAsset" ALTER COLUMN "assetId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "featuredAsset" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "ProjectAssets" ALTER COLUMN "assetId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "UserWallet" ALTER COLUMN "assets" SET DATA TYPE BIGINT[];
