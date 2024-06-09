-- CreateTable
CREATE TABLE `tbl_schools_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `school_name` VARCHAR(191) NOT NULL,
    `main_balance` DOUBLE NOT NULL,
    `prev_main_balance` DOUBLE NOT NULL,
    `masking_sms_count` INTEGER NOT NULL,
    `prev_masking_sms_count` INTEGER NOT NULL,
    `non_masking_sms_count` INTEGER NOT NULL,
    `prev_non_masking_sms_count` INTEGER NOT NULL,
    `masking_sms_price` DOUBLE NOT NULL,
    `prev_masking_sms_price` DOUBLE NOT NULL,
    `non_masking_sms_price` DOUBLE NOT NULL,
    `prev_non_masking_sms_price` DOUBLE NOT NULL,
    `voice_sms_balance` DOUBLE NOT NULL,
    `prev_voice_sms_balance` DOUBLE NOT NULL,
    `voice_sms_price` DOUBLE NOT NULL,
    `prev_voice_sms_price` DOUBLE NOT NULL,
    `voice_pulse_size` INTEGER NOT NULL,
    `prev_voice_pulse_size` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
