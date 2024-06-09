/*
  Warnings:

  - Added the required column `section_id` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `student_results_exam_id_fkey` ON `student_results`;

-- AlterTable
ALTER TABLE `exams` ADD COLUMN `section_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
