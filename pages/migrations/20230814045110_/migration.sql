/*
  Warnings:

  - Added the required column `eiin_number` to the `website_uis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `website_uis` ADD COLUMN `eiin_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `gallery` JSON NULL;
