/*
  Warnings:

  - A unique constraint covering the columns `[school_id]` on the table `sms_gateway` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `payment_gateway_credential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` ENUM('bkash', 'nagad', 'nexus', 'amarPay', 'surjoPay', 'sslcommerz') NOT NULL,
    `details` JSON NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `school_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `payment_gateway_credential_title_school_id_key`(`title`, `school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `sms_gateway_school_id_key` ON `sms_gateway`(`school_id`);

-- AddForeignKey
ALTER TABLE `payment_gateway_credential` ADD CONSTRAINT `payment_gateway_credential_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_gateway_credential` ADD CONSTRAINT `payment_gateway_credential_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
