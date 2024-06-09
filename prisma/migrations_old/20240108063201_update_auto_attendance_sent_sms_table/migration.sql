/*
  Warnings:

  - A unique constraint covering the columns `[school_id]` on the table `auto_attendance_sent_sms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `auto_attendance_sent_sms_school_id_key` ON `auto_attendance_sent_sms`(`school_id`);
