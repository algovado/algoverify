-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "applyWallet" TEXT,
ALTER COLUMN "specialAmount" DROP NOT NULL,
ALTER COLUMN "specialRoleId" DROP NOT NULL;
