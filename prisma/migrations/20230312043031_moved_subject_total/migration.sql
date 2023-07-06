/*
  Warnings:

  - You are about to drop the column `subject_total` on the `student_result_details` table. All the data in the column will be lost.
  - Added the required column `subject_total` to the `exam_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exam_details` ADD COLUMN `subject_total` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `student_result_details` DROP COLUMN `subject_total`;
