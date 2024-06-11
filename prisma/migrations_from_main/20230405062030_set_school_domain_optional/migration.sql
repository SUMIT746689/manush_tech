/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `schools` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `schools` ADD COLUMN `domain` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `websiteuis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `header_image` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `history_photo` VARCHAR(191) NOT NULL,
    `history_description` VARCHAR(191) NOT NULL,
    `chairman_photo` VARCHAR(191) NOT NULL,
    `chairman_speech` VARCHAR(191) NOT NULL,
    `principal_photo` VARCHAR(191) NOT NULL,
    `principal_speech` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `schools_domain_key` ON `schools`(`domain`);

-- AddForeignKey
ALTER TABLE `websiteuis` ADD CONSTRAINT `websiteuis_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
