/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `sections` table. All the data in the column will be lost.
  - You are about to drop the `Request_packages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Request_packages` DROP FOREIGN KEY `Request_packages_package_id_fkey`;

-- DropForeignKey
ALTER TABLE `Request_packages` DROP FOREIGN KEY `Request_packages_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `sections` DROP FOREIGN KEY `sections_groupId_fkey`;

-- AlterTable
ALTER TABLE `Group` DROP COLUMN `schoolId`;

-- AlterTable
ALTER TABLE `sections` DROP COLUMN `groupId`;

-- DropTable
DROP TABLE `Request_packages`;

-- CreateTable
CREATE TABLE `request_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `document_photo` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_packages` ADD CONSTRAINT `request_packages_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_packages` ADD CONSTRAINT `request_packages_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
