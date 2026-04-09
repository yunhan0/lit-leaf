-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChildProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "birthdate" DATETIME,
    "ageGroup" TEXT NOT NULL DEFAULT '2-3',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChildProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "gameCategory" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ChildProfile_userId_idx" ON "ChildProfile"("userId");

-- CreateIndex
CREATE INDEX "GameProgress_profileId_idx" ON "GameProgress"("profileId");
