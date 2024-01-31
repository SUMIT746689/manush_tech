-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` ADD COLUMN `academic_year_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `auto_attendance_sent_sms` ADD CONSTRAINT `auto_attendance_sent_sms_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
