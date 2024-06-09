/*
  Warnings:

  - You are about to drop the `_std_cls_subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_std_cls_subjects` DROP FOREIGN KEY `_std_cls_subjects_A_fkey`;

-- DropForeignKey
ALTER TABLE `_std_cls_subjects` DROP FOREIGN KEY `_std_cls_subjects_B_fkey`;

-- DropTable
DROP TABLE `_std_cls_subjects`;

-- CreateTable
CREATE TABLE `std_cls_subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `std_cls_subjects` ADD CONSTRAINT `std_cls_subjects_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `std_cls_subjects` ADD CONSTRAINT `std_cls_subjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `std_cls_subjects` ADD CONSTRAINT `std_cls_subjects_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
