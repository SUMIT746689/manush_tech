-- DropForeignKey
ALTER TABLE `sent_sms` DROP FOREIGN KEY `sent_sms_sms_template_id_fkey`;

-- AlterTable
ALTER TABLE `sent_sms` MODIFY `sms_template_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `sent_sms` ADD CONSTRAINT `sent_sms_sms_template_id_fkey` FOREIGN KEY (`sms_template_id`) REFERENCES `sms_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
