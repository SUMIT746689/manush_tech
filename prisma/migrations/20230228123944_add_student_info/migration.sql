/*
  Warnings:

  - Added the required column `student_information_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `students` ADD COLUMN `student_information_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_student_information_id_fkey` FOREIGN KEY (`student_information_id`) REFERENCES `student_informations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
