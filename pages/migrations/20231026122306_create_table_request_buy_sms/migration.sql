-- CreateTable
CREATE TABLE `requests_buy_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `masking_count` INTEGER NULL,
    `non_masking_count` INTEGER NULL,
    `document_photo` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'approved', 'declined') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `requests_buy_sms` ADD CONSTRAINT `requests_buy_sms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
