/*
  Warnings:

  - You are about to drop the column `leave_body` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.
  - You are about to drop the column `leave_body_format` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.
  - The values [leave,absent] on the enum `auto_attendance_sent_sms_default_sms_template` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` DROP COLUMN `leave_body`,
    DROP COLUMN `leave_body_format`,
    ADD COLUMN `absence_body` VARCHAR(191) NULL,
    ADD COLUMN `absence_body_format` ENUM('text', 'unicode') NULL,
    MODIFY `default_sms_template` ENUM('present', 'late', 'absence') NOT NULL DEFAULT 'present';
