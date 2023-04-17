-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nonce" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
