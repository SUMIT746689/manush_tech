/*
  Warnings:

  - The values [teacher,others] on the enum `sent_sms_recipient_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `sent_sms` MODIFY `recipient_type` ENUM('group', 'class', 'individual') NULL;

-- AddForeignKey
ALTER TABLE `sent_sms` ADD CONSTRAINT `sent_sms_sms_gateway_id_fkey` FOREIGN KEY (`sms_gateway_id`) REFERENCES `sms_gateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
