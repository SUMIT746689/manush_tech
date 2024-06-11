/*
  Warnings:

  - Added the required column `update_by_user_id` to the `tbl_schools_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_by_user_name` to the `tbl_schools_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_schools_transactions` ADD COLUMN `update_by_user_id` INTEGER NOT NULL,
    ADD COLUMN `update_by_user_name` VARCHAR(191) NOT NULL,
    MODIFY `main_balance` DOUBLE NULL,
    MODIFY `prev_main_balance` DOUBLE NULL,
    MODIFY `masking_sms_count` INTEGER NULL,
    MODIFY `prev_masking_sms_count` INTEGER NULL,
    MODIFY `non_masking_sms_count` INTEGER NULL,
    MODIFY `prev_non_masking_sms_count` INTEGER NULL,
    MODIFY `masking_sms_price` DOUBLE NULL,
    MODIFY `prev_masking_sms_price` DOUBLE NULL,
    MODIFY `non_masking_sms_price` DOUBLE NULL,
    MODIFY `prev_non_masking_sms_price` DOUBLE NULL,
    MODIFY `voice_sms_balance` DOUBLE NULL,
    MODIFY `prev_voice_sms_balance` DOUBLE NULL,
    MODIFY `voice_sms_price` DOUBLE NULL,
    MODIFY `prev_voice_sms_price` DOUBLE NULL,
    MODIFY `voice_pulse_size` INTEGER NULL,
    MODIFY `prev_voice_pulse_size` INTEGER NULL;
