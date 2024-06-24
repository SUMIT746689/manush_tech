-- CreateTable
CREATE TABLE `sms_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fees_collection_sms_body` VARCHAR(191) NULL,
    `is_fees_collection_sms_active` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
