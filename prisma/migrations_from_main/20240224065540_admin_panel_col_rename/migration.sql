/*
  Warnings:

  - You are about to drop the column `copy_right` on the `admin_panels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admin_panels` DROP COLUMN `copy_right`,
    ADD COLUMN `copy_right_txt` VARCHAR(191) NULL;
