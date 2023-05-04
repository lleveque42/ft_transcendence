-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTfaEnable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tfaSecret" TEXT;
