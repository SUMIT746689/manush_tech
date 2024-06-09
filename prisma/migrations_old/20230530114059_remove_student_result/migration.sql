/*
  Warnings:

  - You are about to drop the column `gradingSystemId` on the `student_results` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `student_results` DROP FOREIGN KEY `student_results_gradingSystemId_fkey`;

-- AlterTable
ALTER TABLE `student_results` DROP COLUMN `gradingSystemId`;
