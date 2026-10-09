-- CreateEnum
CREATE TYPE "UtilityCategory" AS ENUM ('GAS', 'ELECTRIC', 'WATER', 'INTERNET', 'TRASH');

-- CreateTable
CREATE TABLE "Place" (
    "zip" CHAR(5) NOT NULL,
    "city" TEXT NOT NULL,
    "state" CHAR(2) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("zip")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "phone" TEXT,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offering" (
    "id" SERIAL NOT NULL,
    "zip" CHAR(5) NOT NULL,
    "providerId" INTEGER NOT NULL,
    "category" "UtilityCategory" NOT NULL,

    CONSTRAINT "Offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Place_city_state_idx" ON "Place"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE INDEX "Offering_zip_category_idx" ON "Offering"("zip", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Offering_zip_providerId_category_key" ON "Offering"("zip", "providerId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Offering" ADD CONSTRAINT "Offering_zip_fkey" FOREIGN KEY ("zip") REFERENCES "Place"("zip") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offering" ADD CONSTRAINT "Offering_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
