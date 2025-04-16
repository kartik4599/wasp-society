/*
  Warnings:

  - A unique constraint covering the columns `[name,buildingId]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_buildingId_key" ON "Unit"("name", "buildingId");
