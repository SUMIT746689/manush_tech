/*
  Warnings:

  - Added the required column `custom_body` to the `sent_sms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sms_template_id` to the `sent_sms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sent_sms` ADD COLUMN `custom_body` VARCHAR(191) NOT NULL,
    ADD COLUMN `sms_template_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `sent_sms` ADD CONSTRAINT `sent_sms_sms_template_id_fkey` FOREIGN KEY (`sms_template_id`) REFERENCES `sms_templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
