/*
  Warnings:

  - Added the required column `headLine` to the `notices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notices` ADD COLUMN `headLine` MEDIUMTEXT NOT NULL;
