-- AlterTable
ALTER TABLE `tbl_student_sent_sms_queue` ADD COLUMN `sent_sms_std_status` ENUM('all_type', 'present', 'late', 'absence') NULL;
