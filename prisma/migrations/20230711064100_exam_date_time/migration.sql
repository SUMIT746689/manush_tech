/*
  Warnings:

  - You are about to alter the column `exam_date` on the `exams` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `exams` MODIFY `exam_date` DATETIME NOT NULL;
