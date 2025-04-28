/*
  Warnings:

  - Made the column `vehicleType` on table `ParkingSlot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" ALTER COLUMN "vehicleType" SET NOT NULL;
