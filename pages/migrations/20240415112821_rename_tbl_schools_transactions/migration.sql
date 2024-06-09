/*
  Warnings:

  - You are about to drop the column `update_by_user_id` on the `tbl_schools_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `update_by_user_name` on the `tbl_schools_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tbl_schools_transactions` DROP COLUMN `update_by_user_id`,
    DROP COLUMN `update_by_user_name`,
    ADD COLUMN `updated_by_user_id` INTEGER NULL,
    ADD COLUMN `updated_by_user_name` VARCHAR(191) NULL;
