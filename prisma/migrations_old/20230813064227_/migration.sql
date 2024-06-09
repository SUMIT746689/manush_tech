/*
  Warnings:

  - You are about to alter the column `payment_method` on the `student_fees` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(13))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `transID` VARCHAR(191) NULL,
    MODIFY `payment_method` VARCHAR(191) NOT NULL;
