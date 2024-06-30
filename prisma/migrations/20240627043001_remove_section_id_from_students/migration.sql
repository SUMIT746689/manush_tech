/*
  Warnings:

  - You are about to drop the column `section_id` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_section_id_fkey`;

-- AlterTable
ALTER TABLE `students` DROP COLUMN `section_id`;
