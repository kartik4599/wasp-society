/*
  Warnings:

  - You are about to drop the column `societyId` on the `ParkingSlot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParkingSlot" DROP CONSTRAINT "ParkingSlot_societyId_fkey";

-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "societyId";
