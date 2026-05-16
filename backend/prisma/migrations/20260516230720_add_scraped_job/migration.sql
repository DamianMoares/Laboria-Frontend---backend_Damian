-- CreateTable
CREATE TABLE "ScrapedJob" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "salary" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "contractType" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'REMOTE',
    "category" TEXT NOT NULL DEFAULT 'general',
    "url" TEXT,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapedJob_pkey" PRIMARY KEY ("id")
);
