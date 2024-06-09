/*
  Warnings:

  - You are about to drop the column `copy_right_msg` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `copy_right_msg`,
    ADD COLUMN `copy_right_txt` VARCHAR(191) NULL;
