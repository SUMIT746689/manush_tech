/*
  Warnings:

  - A unique constraint covering the columns `[student_id,subject_id,teacher_id]` on the table `std_cls_subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `teacher_salary_structure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `section_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `payment_type` ENUM('percentage', 'flat') NOT NULL,
    `percentage_amount` INTEGER NOT NULL,
    `fixed_amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
-- CREATE UNIQUE INDEX `std_cls_subjects_student_id_subject_id_teacher_id_key` ON `std_cls_subjects`(`student_id`, `subject_id`, `teacher_id`);

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
