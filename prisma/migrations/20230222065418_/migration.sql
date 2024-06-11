/*
  Warnings:

  - You are about to drop the `routines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `routines` DROP FOREIGN KEY `routines_period_id_fkey`;

-- DropForeignKey
ALTER TABLE `routines` DROP FOREIGN KEY `routines_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `routines` DROP FOREIGN KEY `routines_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `routines` DROP FOREIGN KEY `routines_teacher_id_fkey`;

-- AlterTable
ALTER TABLE `periods` ADD COLUMN `section_id` INTEGER NULL,
    ADD COLUMN `teacher_id` INTEGER NULL;

-- DropTable
DROP TABLE `routines`;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
