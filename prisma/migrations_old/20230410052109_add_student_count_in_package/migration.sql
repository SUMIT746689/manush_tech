/*
  Warnings:

  - Added the required column `student_count` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `packages` ADD COLUMN `student_count` INTEGER NOT NULL;
