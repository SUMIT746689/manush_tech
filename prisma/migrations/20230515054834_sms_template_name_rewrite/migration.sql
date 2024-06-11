/*
  Warnings:

  - You are about to drop the `SmsTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SmsTemplate` DROP FOREIGN KEY `SmsTemplate_school_id_fkey`;

-- DropTable
DROP TABLE `SmsTemplate`;

-- CreateTable
CREATE TABLE `sms_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sms_templates` ADD CONSTRAINT `sms_templates_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
