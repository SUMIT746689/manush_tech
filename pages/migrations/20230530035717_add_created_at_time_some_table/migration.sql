/*
  Warnings:

  - You are about to drop the column `refrence` on the `vouchers` table. All the data in the column will be lost.
  - Added the required column `reference` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `certificate_templates` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `vouchers` DROP COLUMN `refrence`,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL;
