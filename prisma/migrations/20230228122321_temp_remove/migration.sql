/*
  Warnings:

  - You are about to drop the column `academic_year_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `student_information_id` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_student_information_id_fkey`;

-- AlterTable
ALTER TABLE `students` DROP COLUMN `academic_year_id`,
    DROP COLUMN `student_information_id`;
