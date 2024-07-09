/*
  Warnings:

  - Added the required column `fixed_amount` to the `student_fee_wise_teacher_pays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage_amount` to the `student_fee_wise_teacher_pays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_fee_wise_teacher_pays` ADD COLUMN `fixed_amount` INTEGER NOT NULL,
    ADD COLUMN `percentage_amount` INTEGER NOT NULL;
