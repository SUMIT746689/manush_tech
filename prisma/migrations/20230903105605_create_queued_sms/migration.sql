/*
  Warnings:

  - You are about to drop the column `campaign_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `charges_per_sms` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `coverage_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `coverage_network_name` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `is_black_list` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `is_dlr_requested` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `route_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `route_name` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `tbl_queued_sms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tbl_queued_sms` DROP COLUMN `campaign_id`,
    DROP COLUMN `charges_per_sms`,
    DROP COLUMN `coverage_id`,
    DROP COLUMN `coverage_network_name`,
    DROP COLUMN `is_black_list`,
    DROP COLUMN `is_dlr_requested`,
    DROP COLUMN `route_id`,
    DROP COLUMN `route_name`,
    DROP COLUMN `sender_id`;

-- CreateTable
CREATE TABLE `tbl_attendence_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `machine_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sms_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sms_shoot_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NULL,
    `sms_type` VARCHAR(191) NOT NULL,
    `sms_text` TEXT NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `submission_time` DATETIME(3) NULL,
    `contacts` LONGTEXT NOT NULL,
    `pushed_via` VARCHAR(191) NOT NULL,
    `number_of_sms_parts` INTEGER NOT NULL DEFAULT 1,
    `total_count` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `sms_gateway_status` VARCHAR(191) NULL,
    `fail_count` INTEGER NOT NULL DEFAULT 0,
    `priority` INTEGER NOT NULL DEFAULT 5,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_attendence_queue` ADD CONSTRAINT `tbl_attendence_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_attendence_queue` ADD CONSTRAINT `tbl_attendence_queue_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
