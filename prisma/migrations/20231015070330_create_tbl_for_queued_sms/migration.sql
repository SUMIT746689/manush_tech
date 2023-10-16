/*
  Warnings:

  - You are about to drop the `sent_email_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sent_email_details` DROP FOREIGN KEY `sent_email_details_campaign_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_email_details` DROP FOREIGN KEY `sent_email_details_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `sent_email_details` DROP FOREIGN KEY `sent_email_details_user_id_fkey`;

-- DropTable
DROP TABLE `sent_email_details`;

-- CreateTable
CREATE TABLE `email_campaign_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'success', 'failed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `schoolId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sms_campaign_queued` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'success', 'failed') NOT NULL,
    `user_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email_campaign_details` ADD CONSTRAINT `email_campaign_details_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_campaign_details` ADD CONSTRAINT `email_campaign_details_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_campaign_details` ADD CONSTRAINT `email_campaign_details_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_sms_campaign_queued` ADD CONSTRAINT `tbl_sms_campaign_queued_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_sms_campaign_queued` ADD CONSTRAINT `tbl_sms_campaign_queued_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
