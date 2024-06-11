/*
  Warnings:

  - Added the required column `exam_date` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exams` ADD COLUMN `exam_date` DATETIME(3) NOT NULL;
