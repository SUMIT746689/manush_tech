/*
  Warnings:

  - You are about to drop the column `academic_year_id` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `auto_attendance_sent_sms` DROP FOREIGN KEY `auto_attendance_sent_sms_academic_year_id_fkey`;

-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` DROP COLUMN `academic_year_id`;

-- AlterTable
ALTER TABLE `schools` ADD COLUMN `current_academic_year_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_current_academic_year_id_fkey` FOREIGN KEY (`current_academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
