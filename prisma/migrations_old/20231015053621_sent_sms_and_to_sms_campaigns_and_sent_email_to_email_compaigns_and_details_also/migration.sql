/*
  Warnings:

  - You are about to drop the column `sent_email_id` on the `sent_email_details` table. All the data in the column will be lost.
  - You are about to drop the `sent_email` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sent_sms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sent_sms_details` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `campaign_id` to the `sent_email_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sent_email` DROP FOREIGN KEY `sent_email_email_template_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_email` DROP FOREIGN KEY `sent_email_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_email_details` DROP FOREIGN KEY `sent_email_details_sent_email_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_sms` DROP FOREIGN KEY `sent_sms_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_sms` DROP FOREIGN KEY `sent_sms_sms_gateway_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_sms` DROP FOREIGN KEY `sent_sms_sms_template_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_sms_details` DROP FOREIGN KEY `sent_sms_details_sent_sms_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_sms_details` DROP FOREIGN KEY `sent_sms_details_user_id_fkey`;

-- AlterTable
ALTER TABLE `sent_email_details` DROP COLUMN `sent_email_id`,
    ADD COLUMN `campaign_id` INTEGER NOT NULL,
    ADD COLUMN `schoolId` INTEGER NULL;

-- DropTable
DROP TABLE `sent_email`;

-- DropTable
DROP TABLE `sent_sms`;

-- DropTable
DROP TABLE `sent_sms_details`;

-- CreateTable
CREATE TABLE `sms_campaings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `recipient_type` ENUM('group', 'class', 'individual') NULL,
    `recipient_count` INTEGER NULL,
    `sms_template_id` INTEGER NULL,
    `sms_gateway_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `custom_body` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sms_campaign_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'success', 'failed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_campaigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `recipient_type` ENUM('group', 'class', 'individual') NULL,
    `recipient_count` INTEGER NULL,
    `email_template_id` INTEGER NULL,
    `subject` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `custom_body` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sms_campaings` ADD CONSTRAINT `sms_campaings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaings` ADD CONSTRAINT `sms_campaings_sms_template_id_fkey` FOREIGN KEY (`sms_template_id`) REFERENCES `sms_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaings` ADD CONSTRAINT `sms_campaings_sms_gateway_id_fkey` FOREIGN KEY (`sms_gateway_id`) REFERENCES `sms_gateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaign_details` ADD CONSTRAINT `sms_campaign_details_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `sms_campaings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaign_details` ADD CONSTRAINT `sms_campaign_details_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_campaigns` ADD CONSTRAINT `email_campaigns_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_campaigns` ADD CONSTRAINT `email_campaigns_email_template_id_fkey` FOREIGN KEY (`email_template_id`) REFERENCES `email_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sent_email_details` ADD CONSTRAINT `sent_email_details_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sent_email_details` ADD CONSTRAINT `sent_email_details_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
