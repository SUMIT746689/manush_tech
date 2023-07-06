/*
  Warnings:

  - Added the required column `academic_year_id` to the `grade_systems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `grade_systems` ADD COLUMN `academic_year_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `grade_systems` ADD CONSTRAINT `grade_systems_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
