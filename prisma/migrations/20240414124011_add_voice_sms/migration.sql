-- AlterTable
ALTER TABLE `schools` ADD COLUMN `voice_pulse_size` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `voice_sms_balance` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `voice_sms_price` DOUBLE NOT NULL DEFAULT 0;
