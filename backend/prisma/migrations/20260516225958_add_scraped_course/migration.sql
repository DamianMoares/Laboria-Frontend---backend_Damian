-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('FREE', 'PAID', 'FREEMIUM');

-- CreateTable
CREATE TABLE "ScrapedCourse" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'general',
    "level" "Level" NOT NULL DEFAULT 'BEGINNER',
    "duration" TEXT,
    "price" TEXT,
    "priceType" "PriceType" NOT NULL DEFAULT 'FREE',
    "url" TEXT,
    "image" TEXT,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'es',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "ScrapedCourse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScrapedCourse" ADD CONSTRAINT "ScrapedCourse_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
