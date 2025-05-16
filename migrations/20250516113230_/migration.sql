/*
  Warnings:

  - You are about to drop the column `guestType` on the `Visitor` table. All the data in the column will be lost.
  - Added the required column `visitorType` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisitorType" AS ENUM ('FAMILY', 'FRIEND', 'DELIVERY', 'MAID', 'DRIVER', 'VENDOR', 'OTHER');

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "guestType",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "visitorType" "VisitorType" NOT NULL;

-- DropEnum
DROP TYPE "GuestType";
