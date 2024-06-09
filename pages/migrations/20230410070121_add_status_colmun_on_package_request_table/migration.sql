/*
  Warnings:

  - Added the required column `status` to the `request_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `request_packages` ADD COLUMN `status` ENUM('waiting', 'approved', 'declined') NOT NULL;
