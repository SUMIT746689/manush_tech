/*
  Warnings:

  - You are about to drop the `std_cls_subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `std_cls_subjects` DROP FOREIGN KEY `std_cls_subjects_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `std_cls_subjects` DROP FOREIGN KEY `std_cls_subjects_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `std_cls_subjects` DROP FOREIGN KEY `std_cls_subjects_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `std_cls_subjects` DROP FOREIGN KEY `std_cls_subjects_teacher_id_fkey`;

-- DropTable
DROP TABLE `std_cls_subjects`;

-- CreateTable
CREATE TABLE `_student_subjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_student_subjects_AB_unique`(`A`, `B`),
    INDEX `_student_subjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_student_subjects` ADD CONSTRAINT `_student_subjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_student_subjects` ADD CONSTRAINT `_student_subjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
