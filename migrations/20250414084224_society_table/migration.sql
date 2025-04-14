-- CreateTable
CREATE TABLE "Society" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Society_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Society_createdById_key" ON "Society"("createdById");

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
