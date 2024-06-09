/*
  Warnings:

  - Added the required column `school_id` to the `academic_years` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `academic_years` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `academic_years` ADD CONSTRAINT `academic_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
