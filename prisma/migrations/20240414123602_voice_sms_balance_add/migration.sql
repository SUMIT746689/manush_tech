-- AlterTable
ALTER TABLE `schools` ADD COLUMN `voice_pulse_size` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `voice_sms_balance` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `voice_sms_price` DOUBLE NULL DEFAULT 0;
