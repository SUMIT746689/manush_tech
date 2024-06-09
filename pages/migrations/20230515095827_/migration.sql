-- AlterTable
ALTER TABLE `sent_sms` MODIFY `recipient_count` INTEGER NULL,
    MODIFY `custom_body` VARCHAR(191) NULL;
