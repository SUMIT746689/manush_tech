/*
  Warnings:

  - You are about to drop the column `status` on the `tbl_sms_campaign_queued` table. All the data in the column will be lost.
  - Added the required column `api_key` to the `sms_campaign_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `sms_campaign_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaign_name` to the `sms_campaign_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `sms_campaign_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `sms_campaign_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `api_key` to the `tbl_sms_campaign_queued` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaign_name` to the `tbl_sms_campaign_queued` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `tbl_sms_campaign_queued` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sms_campaign_details` ADD COLUMN `api_key` VARCHAR(191) NOT NULL,
    ADD COLUMN `body` VARCHAR(191) NOT NULL,
    ADD COLUMN `campaign_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `school_id` INTEGER NOT NULL,
    ADD COLUMN `sender_id` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `tbl_sms_campaign_queued` DROP COLUMN `status`,
    ADD COLUMN `api_key` VARCHAR(191) NOT NULL,
    ADD COLUMN `campaign_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `sms_campaign_details` ADD CONSTRAINT `sms_campaign_details_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
