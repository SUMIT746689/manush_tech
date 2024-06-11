/*
  Warnings:

  - A unique constraint covering the columns `[student_id,school_id]` on the table `student_informations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student_informations` ADD COLUMN `student_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `student_informations_student_id_school_id_key` ON `student_informations`(`student_id`, `school_id`);
