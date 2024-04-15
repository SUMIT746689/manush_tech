-- AlterTable
ALTER TABLE `tbl_sent_voice_sms` ADD COLUMN `charges_per_pulses` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `number_of_sms_pulses` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `pulse_size` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_count` INTEGER NOT NULL DEFAULT 0;
