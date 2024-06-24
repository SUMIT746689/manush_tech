/*
  Warnings:

  - You are about to drop the column `logs` on the `sms_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sms_settings` DROP COLUMN `logs`,
    ADD COLUMN `updated_by` JSON NULL;
