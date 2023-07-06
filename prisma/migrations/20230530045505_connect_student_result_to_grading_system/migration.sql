/*
  Warnings:

  - You are about to drop the column `grade` on the `student_results` table. All the data in the column will be lost.
  - Added the required column `grade_id` to the `student_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_results` DROP COLUMN `grade`,
    ADD COLUMN `grade_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `grade_systems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
