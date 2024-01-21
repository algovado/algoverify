-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_projectId_fkey";

-- DropForeignKey
ALTER TABLE "AssetCounts" DROP CONSTRAINT "AssetCounts_projectId_fkey";

-- DropForeignKey
ALTER TABLE "AssetCounts" DROP CONSTRAINT "AssetCounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "BlacklistedAsset" DROP CONSTRAINT "BlacklistedAsset_projectId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorWallet" DROP CONSTRAINT "CreatorWallet_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAssets" DROP CONSTRAINT "ProjectAssets_projectId_fkey";

-- AddForeignKey
ALTER TABLE "CreatorWallet" ADD CONSTRAINT "CreatorWallet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlacklistedAsset" ADD CONSTRAINT "BlacklistedAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssets" ADD CONSTRAINT "ProjectAssets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCounts" ADD CONSTRAINT "AssetCounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCounts" ADD CONSTRAINT "AssetCounts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
