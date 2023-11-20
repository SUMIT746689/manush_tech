/*
  Warnings:

  - You are about to drop the column `total_mark` on the `student_addtional_result_details` table. All the data in the column will be lost.
  - Added the required column `mark_obtained` to the `student_addtional_result_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_addtional_result_details` DROP COLUMN `total_mark`,
    ADD COLUMN `mark_obtained` DOUBLE NOT NULL;
