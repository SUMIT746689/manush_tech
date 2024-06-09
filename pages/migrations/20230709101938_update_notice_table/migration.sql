/*
  Warnings:

  - You are about to alter the column `description` on the `notices` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `notices` MODIFY `description` JSON NOT NULL;
