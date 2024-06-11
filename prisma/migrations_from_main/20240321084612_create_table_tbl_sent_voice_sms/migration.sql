-- CreateTable
CREATE TABLE `tbl_sent_voice_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(191) NOT NULL,
    `send_by_user_id` INTEGER NOT NULL,
    `send_by_user_name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `voice_url` VARCHAR(191) NOT NULL,
    `contacts` LONGTEXT NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `is_masking` BOOLEAN NOT NULL,
    `pushed_via` ENUM('voice_recipient', 'group_contact', 'file_upload') NOT NULL,
    `school_id` INTEGER NOT NULL,
    `logs` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_sent_voice_sms_message_id_key`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
