/*
  Warnings:

  - You are about to alter the column `status` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(4))`.
  - Added the required column `collected_amount` to the `student_fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendances` ADD COLUMN `remark` VARCHAR(191) NULL,
    MODIFY `status` ENUM('present', 'absent', 'late', 'bunk', 'holiday') NOT NULL;

-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `collected_amount` DOUBLE NOT NULL;
