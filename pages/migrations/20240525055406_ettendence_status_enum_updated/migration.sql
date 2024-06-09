/*
  Warnings:

  - The values [absent] on the enum `attendances_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `attendances` MODIFY `status` ENUM('present', 'absence', 'late', 'bunk', 'holiday', 'row_status') NOT NULL;
