/*
  Warnings:

  - You are about to drop the column `is_active` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.
  - You are about to drop the column `is_auto_admission_sms` on the `auto_attendance_sent_sms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` DROP COLUMN `is_active`,
    DROP COLUMN `is_auto_admission_sms`,
    ADD COLUMN `is_absence_sms_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_admission_sms_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_attendence_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_late_sms_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_present_sms_active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_sms_active` BOOLEAN NOT NULL DEFAULT false;
