/*
  Warnings:

  - You are about to drop the column `sms_masking_price` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `sms_non_masking_price` on the `schools` table. All the data in the column will be lost.
  - Made the column `masking_sms_count` on table `schools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `non_masking_sms_count` on table `schools` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attendances` MODIFY `date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `schools` DROP COLUMN `sms_masking_price`,
    DROP COLUMN `sms_non_masking_price`,
    ADD COLUMN `masking_sms_price` DOUBLE NULL,
    ADD COLUMN `non_masking_sms_price` DOUBLE NULL,
    MODIFY `masking_sms_count` INTEGER NOT NULL DEFAULT 0,
    MODIFY `non_masking_sms_count` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `sms_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `masking_count` INTEGER NULL,
    `non_masking_count` INTEGER NULL,
    `prev_masking_count` INTEGER NOT NULL,
    `prev_non_masking_count` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sms_transactions` ADD CONSTRAINT `sms_transactions_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
