/*
  Warnings:

  - A unique constraint covering the columns `[school_id]` on the table `sms_settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `school_id` to the `sms_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sms_settings` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `logs` VARCHAR(191) NULL,
    ADD COLUMN `school_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sms_settings_school_id_key` ON `sms_settings`(`school_id`);

-- AddForeignKey
ALTER TABLE `sms_settings` ADD CONSTRAINT `sms_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
