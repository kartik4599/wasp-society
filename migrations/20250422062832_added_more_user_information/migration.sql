-- CreateEnum
CREATE TYPE "IdentityType" AS ENUM ('aadhaar', 'passport', 'drivingLicense', 'panCard', 'voterId', 'rationCard', 'other');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "PersonalInformation" (
    "id" SERIAL NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "primaryIdentityType" "IdentityType" NOT NULL,
    "primaryIdentityNumber" TEXT NOT NULL,
    "secondaryIdentityType" "IdentityType",
    "secondaryIdentityNumber" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PersonalInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalInformation" (
    "id" SERIAL NOT NULL,
    "alternativePhoneNumber" TEXT,
    "alternativeEmail" TEXT,
    "emergencyContactNumber" TEXT NOT NULL,
    "emergencyContactName" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "organizationName" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AdditionalInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberInformation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MemberInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalInformation_userId_key" ON "PersonalInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalInformation_userId_key" ON "AdditionalInformation"("userId");

-- AddForeignKey
ALTER TABLE "PersonalInformation" ADD CONSTRAINT "PersonalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalInformation" ADD CONSTRAINT "AdditionalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInformation" ADD CONSTRAINT "MemberInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
