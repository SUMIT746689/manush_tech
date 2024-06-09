/*
  Warnings:

  - You are about to drop the `Syllabus_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Syllabus_details` DROP FOREIGN KEY `Syllabus_details_syllabus_id_fkey`;

-- DropTable
DROP TABLE `Syllabus_details`;

-- CreateTable
CREATE TABLE `syllabus_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `syllabus_id` INTEGER NOT NULL,
    `body` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_details_id` INTEGER NOT NULL,
    `content` LONGTEXT NULL,
    `file` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `syllabus_details` ADD CONSTRAINT `syllabus_details_syllabus_id_fkey` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
