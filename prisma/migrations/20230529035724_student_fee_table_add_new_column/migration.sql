/*
  Warnings:

  - Added the required column `collected_by` to the `student_fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `student_fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `collected_by` INTEGER NOT NULL,
    ADD COLUMN `payment_method` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_collected_by_fkey` FOREIGN KEY (`collected_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
