/*
  Warnings:

  - You are about to drop the `tbl_manual_attendace_queue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbl_manual_attendace_queue` DROP FOREIGN KEY `tbl_manual_attendace_queue_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_manual_attendace_queue` DROP FOREIGN KEY `tbl_manual_attendace_queue_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_manual_attendace_queue` DROP FOREIGN KEY `tbl_manual_attendace_queue_user_id_fkey`;

-- DropTable
DROP TABLE `tbl_manual_attendace_queue`;

-- CreateTable
CREATE TABLE `tbl_manual_student_attendace_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `section_id` INTEGER NULL,
    `school_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
