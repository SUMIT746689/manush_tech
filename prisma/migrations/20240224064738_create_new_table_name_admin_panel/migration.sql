/*
  Warnings:

  - You are about to drop the column `copy_right_txt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `copy_right_txt`,
    DROP COLUMN `domain`,
    DROP COLUMN `logo`,
    ADD COLUMN `admin_panel_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `admin_panels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `domain` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `copy_right` VARCHAR(191) NULL,

    UNIQUE INDEX `admin_panels_domain_key`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_admin_panel_id_fkey` FOREIGN KEY (`admin_panel_id`) REFERENCES `admin_panels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
