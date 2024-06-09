/*
  Warnings:

  - Added the required column `exam_id` to the `student_result_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_result_details` ADD COLUMN `exam_id` INTEGER NOT NULL;
