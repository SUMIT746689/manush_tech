/*
  Warnings:

  - Added the required column `subject_id` to the `studentFeeWiseTeacherPay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `studentFeeWiseTeacherPay` ADD COLUMN `subject_id` INTEGER NOT NULL;
