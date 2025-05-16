-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workingSocietyId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workingSocietyId_fkey" FOREIGN KEY ("workingSocietyId") REFERENCES "Society"("id") ON DELETE SET NULL ON UPDATE CASCADE;
