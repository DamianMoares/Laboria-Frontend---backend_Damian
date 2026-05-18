-- Safely convert LoginSession.userRole from TEXT to Role enum
-- preserving existing data

-- Add temporary column with the enum type
ALTER TABLE "LoginSession" ADD COLUMN "userRole_temp" "Role";

-- Cast existing text values to the enum (they already match: CANDIDATE, ADMIN, etc.)
UPDATE "LoginSession" SET "userRole_temp" = "userRole"::"Role";

-- Drop the old text column
ALTER TABLE "LoginSession" DROP COLUMN "userRole";

-- Rename temp column to original name
ALTER TABLE "LoginSession" RENAME COLUMN "userRole_temp" TO "userRole";

-- Add NOT NULL constraint now that data is migrated
ALTER TABLE "LoginSession" ALTER COLUMN "userRole" SET NOT NULL;
