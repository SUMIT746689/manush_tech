/*
  Warnings:

  - Added the required column `user_role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `user_role` VARCHAR(191) NOT NULL;
