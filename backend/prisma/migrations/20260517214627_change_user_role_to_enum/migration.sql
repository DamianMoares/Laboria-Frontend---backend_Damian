/*
  Warnings:

  - Changed the type of `userRole` on the `LoginSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoginSession" DROP COLUMN "userRole",
ADD COLUMN     "userRole" "Role" NOT NULL;
