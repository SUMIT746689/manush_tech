/*
  Warnings:

  - Added the required column `grade_id` to the `student_result_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_result_details` ADD COLUMN `grade_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `grade_systems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
