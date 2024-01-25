/*
  Warnings:

  - You are about to alter the column `sender_id` on the `tbl_queued_sms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `sender_id` on the `tbl_sent_sms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `tbl_queued_sms` MODIFY `sender_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tbl_sent_sms` MODIFY `sender_id` INTEGER NOT NULL;
