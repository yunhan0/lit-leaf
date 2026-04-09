-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChildProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "birthdate" DATETIME,
    "ageGroup" TEXT NOT NULL DEFAULT '2-3',
    "totalStars" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChildProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChildProfile" ("ageGroup", "avatar", "birthdate", "createdAt", "id", "name", "userId") SELECT "ageGroup", "avatar", "birthdate", "createdAt", "id", "name", "userId" FROM "ChildProfile";
DROP TABLE "ChildProfile";
ALTER TABLE "new_ChildProfile" RENAME TO "ChildProfile";
CREATE INDEX "ChildProfile_userId_idx" ON "ChildProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
