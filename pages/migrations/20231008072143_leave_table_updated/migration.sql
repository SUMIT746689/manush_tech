/*
  Warnings:

  - Added the required column `Leave_type` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Leave` ADD COLUMN `Leave_type` ENUM('sick', 'casual', 'maternity') NOT NULL,
    ADD COLUMN `approved_by_id` INTEGER NULL,
    ADD COLUMN `remarks` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_approved_by_id_fkey` FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
