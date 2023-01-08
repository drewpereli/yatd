/*
  Warnings:

  - You are about to drop the column `content` on the `Todo` table. All the data in the column will be lost.
  - Made the column `title` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "content",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "title" SET NOT NULL;
