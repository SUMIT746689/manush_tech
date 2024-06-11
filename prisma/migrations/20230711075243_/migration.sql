/*
  Warnings:

  - You are about to drop the column `exam_date` on the `exams` table. All the data in the column will be lost.
  - Added the required column `exam_date` to the `exam_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exam_details` ADD COLUMN `exam_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `exams` DROP COLUMN `exam_date`;
