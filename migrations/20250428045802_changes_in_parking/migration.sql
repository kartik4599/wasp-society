/*
  Warnings:

  - You are about to drop the column `isOccupied` on the `ParkingSlot` table. All the data in the column will be lost.
  - Added the required column `status` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "isOccupied",
ADD COLUMN     "status" "RoomStatus" NOT NULL,
ADD COLUMN     "vehicleModal" TEXT;
