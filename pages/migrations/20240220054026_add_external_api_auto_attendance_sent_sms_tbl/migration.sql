-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` ADD COLUMN `external_api_info` JSON NULL,
    ADD COLUMN `use_system_type` ENUM('automatic', 'external_api') NOT NULL DEFAULT 'automatic',
    MODIFY `body` VARCHAR(191) NULL;
