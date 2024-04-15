-- AlterTable
ALTER TABLE `sms_transactions` ADD COLUMN `prev_voice_sms_balance` DOUBLE NULL,
    ADD COLUMN `pushed_via` VARCHAR(191) NULL,
    ADD COLUMN `user_id` INTEGER NULL,
    ADD COLUMN `user_name` VARCHAR(191) NULL,
    ADD COLUMN `voice_sms_balance` DOUBLE NULL,
    MODIFY `prev_masking_count` INTEGER NULL,
    MODIFY `prev_non_masking_count` INTEGER NULL;

-- AlterTable
ALTER TABLE `tbl_sent_voice_sms` ADD COLUMN `voice_duration` INTEGER NOT NULL DEFAULT 0;
