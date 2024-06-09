-- AlterTable
ALTER TABLE `schools` MODIFY `masking_sms_price` DOUBLE NULL DEFAULT 0,
    MODIFY `non_masking_sms_price` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tbl_queued_sms` ADD COLUMN `priority` INTEGER NOT NULL DEFAULT 5;
