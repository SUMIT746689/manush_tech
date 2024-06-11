/*
  Warnings:

  - You are about to alter the column `payment_method` on the `student_fees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `student_fees` MODIFY `payment_method` ENUM('cash', 'online') NOT NULL;
