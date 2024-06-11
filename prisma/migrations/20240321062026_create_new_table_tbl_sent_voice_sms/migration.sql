-- CreateTable
CREATE TABLE `tbl_sent_voice_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('pending', 'success', 'error') NOT NULL DEFAULT 'pending',
    `voice_url` VARCHAR(191) NOT NULL,
    `contacts` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
