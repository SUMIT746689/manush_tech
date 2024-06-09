/*
  Warnings:

  - The values [waiting] on the enum `request_packages_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `request_packages` MODIFY `status` ENUM('pending', 'approved', 'declined') NOT NULL;
