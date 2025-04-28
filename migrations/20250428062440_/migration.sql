/*
  Warnings:

  - You are about to drop the column `vehicleModal` on the `ParkingSlot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "vehicleModal",
ADD COLUMN     "vehicleModel" TEXT;
