/*
  Warnings:

  - You are about to drop the column `body` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.
  - You are about to drop the column `body_format` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` DROP COLUMN `body`,
    DROP COLUMN `body_format`,
    ADD COLUMN `admission_body` VARCHAR(191) NULL,
    ADD COLUMN `admission_body_format` ENUM('text', 'unicode') NULL,
    ADD COLUMN `default_sms_template` ENUM('present', 'leave', 'absent') NOT NULL DEFAULT 'present',
    ADD COLUMN `late_body` VARCHAR(191) NULL,
    ADD COLUMN `late_body_format` ENUM('text', 'unicode') NULL,
    ADD COLUMN `leave_body` VARCHAR(191) NULL,
    ADD COLUMN `leave_body_format` ENUM('text', 'unicode') NULL,
    ADD COLUMN `present_body` VARCHAR(191) NULL,
    ADD COLUMN `present_body_format` ENUM('text', 'unicode') NULL;
