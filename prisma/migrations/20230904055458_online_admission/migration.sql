/*
  Warnings:

  - You are about to drop the column `campaign_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `charges_per_sms` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `coverage_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `coverage_network_name` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `is_black_list` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `is_dlr_requested` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `route_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `route_name` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `tbl_queued_sms` table. All the data in the column will be lost.
  - Added the required column `school_id` to the `OnlineAdmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OnlineAdmission` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tbl_queued_sms` DROP COLUMN `campaign_id`,
    DROP COLUMN `charges_per_sms`,
    DROP COLUMN `coverage_id`,
    DROP COLUMN `coverage_network_name`,
    DROP COLUMN `is_black_list`,
    DROP COLUMN `is_dlr_requested`,
    DROP COLUMN `route_id`,
    DROP COLUMN `route_name`,
    DROP COLUMN `sender_id`;

-- AddForeignKey
ALTER TABLE `OnlineAdmission` ADD CONSTRAINT `OnlineAdmission_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
