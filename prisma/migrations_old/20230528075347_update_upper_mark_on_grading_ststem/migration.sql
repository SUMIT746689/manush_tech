/*
  Warnings:

  - Added the required column `upper_mark` to the `grade_systems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `grade_systems` ADD COLUMN `upper_mark` DOUBLE NOT NULL;
