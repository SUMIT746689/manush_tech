/*
  Warnings:

  - You are about to drop the column `sms_count` on the `schools` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schools` DROP COLUMN `sms_count`,
    ADD COLUMN `masking_sms_count` INTEGER NULL,
    ADD COLUMN `non_masking_sms_count` INTEGER NULL;
