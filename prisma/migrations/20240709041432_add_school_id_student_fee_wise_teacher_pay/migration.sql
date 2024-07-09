/*
  Warnings:

  - Added the required column `school_id` to the `student_fee_wise_teacher_pays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_fee_wise_teacher_pays` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `student_fee_wise_teacher_pays` ADD CONSTRAINT `student_fee_wise_teacher_pays_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
