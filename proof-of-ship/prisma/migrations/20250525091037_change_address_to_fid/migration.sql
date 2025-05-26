-- CreateTable
CREATE TABLE "BuilderProfile" (
    "id" TEXT NOT NULL,
    "fid" TEXT NOT NULL,
    "isVerified" BOOLEAN DEFAULT false,
    "talentScore" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuilderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyTopBuilder" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "talentScore" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyTopBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuilderProfile_fid_key" ON "BuilderProfile"("fid");

-- CreateIndex
CREATE INDEX "WeeklyTopBuilder_weekStart_idx" ON "WeeklyTopBuilder"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyTopBuilder_wallet_weekStart_key" ON "WeeklyTopBuilder"("wallet", "weekStart");
