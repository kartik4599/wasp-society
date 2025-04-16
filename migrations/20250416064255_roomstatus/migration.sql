-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('occupied', 'available', 'underMaintenance', 'notAvailable');

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'available';
