/*
  Warnings:

  - You are about to drop the column `class_id` on the `exams` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_class_id_fkey`;

-- AlterTable
ALTER TABLE `exams` DROP COLUMN `class_id`;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
