/*
  Warnings:

  - Added the required column `teacher_id` to the `student_fee_wise_teacher_pays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_fee_wise_teacher_pays` ADD COLUMN `teacher_id` INTEGER NOT NULL;
