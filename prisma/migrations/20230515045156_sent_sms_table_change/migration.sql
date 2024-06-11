/*
  Warnings:

  - You are about to drop the `send_sms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `send_sms` DROP FOREIGN KEY `send_sms_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `sent_sms_details` DROP FOREIGN KEY `sent_sms_details_sent_sms_id_fkey`;

-- DropTable
DROP TABLE `send_sms`;

-- CreateTable
CREATE TABLE `sent_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sms_gateway_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `recipient_type` ENUM('class', 'teacher', 'others', 'individual') NULL,
    `recipient_count` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sent_sms` ADD CONSTRAINT `sent_sms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sent_sms_details` ADD CONSTRAINT `sent_sms_details_sent_sms_id_fkey` FOREIGN KEY (`sent_sms_id`) REFERENCES `sent_sms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
