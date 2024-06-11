/*
  Warnings:

  - You are about to drop the column `request_status` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sections` ADD COLUMN `groupId` INTEGER NULL,
    ADD COLUMN `group_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `subscriptions` DROP COLUMN `request_status`;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `class_id` INTEGER NOT NULL,
    `schoolId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `document_photo` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request_packages` ADD CONSTRAINT `Request_packages_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request_packages` ADD CONSTRAINT `Request_packages_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
