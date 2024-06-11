/*
  Warnings:

  - You are about to drop the column `group_id` on the `sections` table. All the data in the column will be lost.
  - You are about to drop the `websiteuis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sections` DROP FOREIGN KEY `sections_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `websiteuis` DROP FOREIGN KEY `websiteuis_school_id_fkey`;

-- AlterTable
ALTER TABLE `sections` DROP COLUMN `group_id`;

-- DropTable
DROP TABLE `websiteuis`;

-- CreateTable
CREATE TABLE `website_uis` (
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

-- CreateTable
CREATE TABLE `_GroupToSection` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GroupToSection_AB_unique`(`A`, `B`),
    INDEX `_GroupToSection_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `website_uis` ADD CONSTRAINT `website_uis_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSection` ADD CONSTRAINT `_GroupToSection_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSection` ADD CONSTRAINT `_GroupToSection_B_fkey` FOREIGN KEY (`B`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
