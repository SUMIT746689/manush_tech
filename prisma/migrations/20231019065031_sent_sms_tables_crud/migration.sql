/*
  Warnings:

  - You are about to drop the column `fail_count` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the `email_campaign_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sms_campaign_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_sms_campaign_queued` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbl_sms_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `school_id` to the `tbl_queued_sms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_name` to the `tbl_queued_sms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `tbl_queued_sms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `email_campaign_details` DROP FOREIGN KEY `email_campaign_details_campaign_id_fkey`;

-- DropForeignKey
ALTER TABLE `email_campaign_details` DROP FOREIGN KEY `email_campaign_details_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `email_campaign_details` DROP FOREIGN KEY `email_campaign_details_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `sms_campaign_details` DROP FOREIGN KEY `sms_campaign_details_campaign_id_fkey`;

-- DropForeignKey
ALTER TABLE `sms_campaign_details` DROP FOREIGN KEY `sms_campaign_details_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `sms_campaign_details` DROP FOREIGN KEY `sms_campaign_details_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_sms_campaign_queued` DROP FOREIGN KEY `tbl_sms_campaign_queued_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_sms_campaign_queued` DROP FOREIGN KEY `tbl_sms_campaign_queued_user_id_fkey`;

-- AlterTable
ALTER TABLE `schools` ADD COLUMN `main_balance` DOUBLE NULL,
    ADD COLUMN `sms_count` INTEGER NULL,
    ADD COLUMN `sms_masking_price` DOUBLE NULL,
    ADD COLUMN `sms_non_masking_price` DOUBLE NULL;

-- AlterTable
ALTER TABLE `tbl_queued_sms` DROP COLUMN `fail_count`,
    DROP COLUMN `priority`,
    ADD COLUMN `charges_per_sms` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `school_id` INTEGER NOT NULL,
    ADD COLUMN `school_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `email_campaign_details`;

-- DropTable
DROP TABLE `sms_campaign_details`;

-- DropTable
DROP TABLE `tbl_sms_campaign_queued`;

-- DropTable
DROP TABLE `tbl_sms_history`;

-- CreateTable
CREATE TABLE `tbl_sent_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sms_shoot_id` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `school_name` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `contacts` LONGTEXT NOT NULL,
    `pushed_via` VARCHAR(191) NOT NULL,
    `charges_per_sms` DOUBLE NOT NULL DEFAULT 0,
    `number_of_sms_parts` INTEGER NOT NULL DEFAULT 1,
    `total_count` INTEGER NOT NULL,
    `sms_type` VARCHAR(191) NOT NULL,
    `sms_text` TEXT NOT NULL,
    `submission_time` DATETIME(3) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `sms_gateway_status` VARCHAR(191) NULL,

    UNIQUE INDEX `tbl_sent_sms_id_status_key`(`id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
