-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "maintenance" DOUBLE PRECISION,
ALTER COLUMN "depositAmount" DROP NOT NULL;
