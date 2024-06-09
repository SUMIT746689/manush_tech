-- AlterTable
ALTER TABLE `subscriptions` ADD COLUMN `request_status` ENUM('pending', 'active') NULL;
