/*
  Warnings:

  - Added the required column `name` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSlot" ADD COLUMN     "name" TEXT NOT NULL;
